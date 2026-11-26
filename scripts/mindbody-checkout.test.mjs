import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createGiftCardCheckout } from "../src/mindbody-checkout.ts";
import { GIFT_CARD_OPTIONS, isGiftCardFrame } from "../src/gift-card-options.ts";

function fixture() {
  const root = Object.assign(new EventTarget(), { activeElement: null });
  const elements = new Map();
  const frames = [];
  const timers = new Map();
  const node = (id) => {
    const target = new EventTarget();
    Object.assign(target, {
      id,
      hidden: false,
      dataset: {},
      attributes: new Map(),
      textContent: "",
      setAttribute: (key, value) => target.attributes.set(key, value),
      removeAttribute: (key) => target.attributes.delete(key),
      focus: () => {
        root.activeElement = target;
      },
      append: (child) => {
        target.child = child;
      }
    });
    elements.set(id, target);
    return target;
  };
  for (const id of [
    "gift-card-checkout",
    "gift-card-offer",
    "offer",
    "trigger",
    "checkout-options",
    "checkout-back",
    "checkout-resume",
    "checkout-retry",
    "checkout-hosted",
    "checkout-status",
    "checkout-recovery",
    "mindbody-checkout-host"
  ])
    node(id);
  const get = (id) => elements.get(id);
  for (const id of [
    "gift-card-checkout",
    "mindbody-checkout-host",
    "checkout-resume",
    "checkout-status",
    "checkout-recovery"
  ])
    get(id).hidden = true;
  const links = GIFT_CARD_OPTIONS.map((option) =>
    Object.assign(node(option.id), { href: option.url })
  );
  root.getElementById = get;
  root.querySelector = () => get("trigger");
  root.querySelectorAll = () => links;
  root.createElement = (tag) => {
    assert.equal(tag, "iframe");
    const frame = node(`frame-${frames.length}`);
    const navigations = [];
    Object.defineProperty(frame, "src", {
      get: () => navigations.at(-1),
      set: (url) => navigations.push(url)
    });
    frame.navigations = navigations;
    frames.push(frame);
    return frame;
  };
  let timerId = 0;
  const controller = createGiftCardCheckout(root, {
    schedule: (callback) => {
      timers.set(++timerId, callback);
      return timerId;
    },
    cancel: (id) => timers.delete(id)
  });
  const click = (target, extra = {}) => {
    const event = Object.assign(new Event("click", { cancelable: true }), {
      button: 0,
      ...extra
    });
    target.dispatchEvent(event);
    return event;
  };
  return {
    root,
    get,
    links,
    frames,
    timers,
    controller,
    click,
    select: (index = 0, extra = {}) => click(links[index], extra),
    load: () => frames[0].dispatchEvent(new Event("load")),
    timeout: () => {
      const callbacks = [...timers.values()];
      timers.clear();
      callbacks.forEach((callback) => callback());
    }
  };
}

test("opening shows local options without creating a frame or vendor request", () => {
  const f = fixture();
  f.controller.open();
  assert.equal(f.frames.length, 0);
  assert.equal(f.get("gift-card-checkout").hidden, false);
  assert.equal(f.get("gift-card-offer").inert, true);
  assert.equal(f.get("gift-card-offer").attributes.get("aria-hidden"), "true");
  assert.equal(f.root.activeElement, f.get("checkout-back"));
  f.controller.dispose();
});

test("each package uses its verified purchase URL inside one payment-enabled frame", () => {
  const f = fixture();
  f.controller.open();
  for (let i = 0; i < f.links.length; i++) {
    assert.equal(f.select(i).defaultPrevented, true);
    assert.equal(f.frames.length, 1);
    assert.equal(f.frames[0].src, GIFT_CARD_OPTIONS[i].url);
    assert.equal(f.frames[0].title, "Mindbody gift card checkout");
    assert.equal(f.frames[0].attributes.get("allow"), "payment");
    assert.equal(
      f.get("checkout-hosted").attributes.get("href"),
      GIFT_CARD_OPTIONS[i].url
    );
    assert.equal(f.get("mindbody-checkout-host").dataset.state, "loading");
    assert.equal(f.get("mindbody-checkout-host").attributes.get("aria-busy"), "true");
  }
  f.controller.dispose();
});

test("frame loading reveals vendor content and ends only the display status", () => {
  const f = fixture();
  f.controller.open();
  f.select();
  f.load();
  assert.equal(f.get("mindbody-checkout-host").dataset.state, "ready");
  assert.equal(f.get("mindbody-checkout-host").attributes.get("aria-busy"), "false");
  assert.equal(f.get("checkout-status").hidden, true);
  assert.equal(f.get("checkout-recovery").hidden, true);
  assert.equal(f.root.activeElement, f.frames[0]);
  assert.equal(f.timers.size, 0);
  f.controller.dispose();
});

test("a timeout exposes retry and the selected package fallback", () => {
  const f = fixture();
  f.controller.open();
  f.select(1);
  f.timeout();
  assert.equal(f.get("mindbody-checkout-host").dataset.state, "error");
  assert.equal(f.get("checkout-recovery").hidden, false);
  assert.match(f.get("checkout-status").textContent, /couldn’t load/);
  assert.equal(
    f.get("checkout-hosted").attributes.get("href"),
    GIFT_CARD_OPTIONS[1].url
  );
  f.controller.dispose();
});

test("a blocked frame shows recovery even if the browser also fires load", () => {
  const f = fixture();
  f.controller.open();
  f.select();
  f.root.dispatchEvent(
    Object.assign(new Event("securitypolicyviolation"), {
      effectiveDirective: "frame-src",
      blockedURI: "https://go.mindbodyonline.com"
    })
  );
  f.load();
  assert.equal(f.get("mindbody-checkout-host").dataset.state, "error");
  assert.equal(f.get("checkout-recovery").hidden, false);
  f.click(f.get("checkout-retry"));
  f.load();
  assert.equal(f.get("mindbody-checkout-host").dataset.state, "ready");
  f.controller.dispose();
});

test("frame errors can retry and a late load can clear recovery", () => {
  const f = fixture();
  f.controller.open();
  f.select();
  f.frames[0].dispatchEvent(new Event("error"));
  assert.equal(f.get("checkout-recovery").hidden, false);
  f.click(f.get("checkout-retry"));
  assert.equal(f.get("mindbody-checkout-host").dataset.state, "loading");
  assert.equal(f.frames.length, 1);
  assert.equal(f.frames[0].navigations.length, 2);
  f.timeout();
  f.load();
  assert.equal(f.get("checkout-recovery").hidden, true);
  assert.equal(f.get("mindbody-checkout-host").dataset.state, "ready");
  f.controller.dispose();
});

test("one close returns to the offer and resume retains the checkout document", () => {
  const f = fixture();
  f.controller.open();
  f.select();
  f.load();
  f.click(f.get("checkout-back"));
  assert.equal(f.get("checkout-options").hidden, false);
  assert.equal(f.get("mindbody-checkout-host").hidden, true);
  assert.equal(f.get("gift-card-checkout").hidden, true);
  assert.equal(f.get("gift-card-offer").inert, false);
  assert.equal(f.root.activeElement, f.get("trigger"));
  assert.equal(f.get("checkout-back").attributes.get("aria-label"), "Close gift cards");
  f.controller.open();
  f.click(f.get("checkout-resume"));
  assert.equal(f.get("mindbody-checkout-host").hidden, false);
  assert.equal(f.root.activeElement, f.frames[0]);
  assert.equal(f.frames[0].navigations.length, 1);
  assert.equal(f.get("checkout-back").attributes.get("aria-label"), "Close checkout");
  f.controller.dispose();
});

test("selecting the same option retains its existing checkout", () => {
  const f = fixture();
  f.controller.open();
  f.select();
  f.load();
  f.click(f.get("checkout-back"));
  f.controller.open();
  f.select();
  assert.equal(f.frames[0].navigations.length, 1);
  f.controller.dispose();
});

test("returning to the offer restores focus and reopening preserves checkout", () => {
  const f = fixture();
  f.controller.open();
  f.select();
  f.load();
  f.click(f.get("checkout-back"));
  assert.equal(f.get("gift-card-checkout").hidden, true);
  assert.equal(f.get("gift-card-offer").inert, false);
  assert.equal(f.get("gift-card-offer").attributes.has("aria-hidden"), false);
  assert.equal(f.root.activeElement, f.get("trigger"));
  f.controller.open();
  f.click(f.get("checkout-resume"));
  assert.equal(f.frames.length, 1);
  assert.equal(f.frames[0].navigations.length, 1);
  f.controller.dispose();
});

test("late readiness after returning or closing does not steal focus", () => {
  const f = fixture();
  f.controller.open();
  f.select();
  f.click(f.get("checkout-back"));
  f.load();
  assert.equal(f.root.activeElement, f.get("trigger"));
  assert.equal(f.get("gift-card-checkout").hidden, true);
  assert.equal(f.get("checkout-recovery").hidden, true);
  f.controller.dispose();
});

test("one activation closes the selector, loading, ready and error views", () => {
  for (const state of ["selector", "loading", "ready", "error"]) {
    const f = fixture();
    f.controller.open();
    if (state !== "selector") f.select();
    if (state === "ready") f.load();
    if (state === "error") f.timeout();
    f.click(f.get("checkout-back"));
    assert.equal(f.get("gift-card-checkout").hidden, true, state);
    assert.equal(f.get("checkout-options").hidden, false, state);
    assert.equal(f.get("mindbody-checkout-host").hidden, true, state);
    assert.equal(f.get("checkout-status").hidden, true, state);
    assert.equal(f.get("checkout-recovery").hidden, true, state);
    assert.equal(f.get("gift-card-offer").inert, false, state);
    assert.equal(f.get("gift-card-offer").attributes.has("aria-hidden"), false, state);
    assert.equal(f.get("trigger").attributes.get("aria-expanded"), "false", state);
    assert.equal(f.root.activeElement, f.get("trigger"), state);
    f.controller.dispose();
  }
});

test("modified package clicks preserve explicit browser navigation", () => {
  for (const extra of [
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 }
  ]) {
    const f = fixture();
    f.controller.open();
    assert.equal(f.select(0, extra).defaultPrevented, false);
    assert.equal(f.frames.length, 0);
    f.controller.dispose();
  }
});

test("untrusted or tampered destinations never create a checkout frame", () => {
  for (const url of [
    "javascript:alert(1)",
    GIFT_CARD_OPTIONS[0].url.replace("https:", "http:"),
    GIFT_CARD_OPTIONS[0].url.replace(
      "go.mindbodyonline.com",
      "go.mindbodyonline.com.evil.example"
    ),
    GIFT_CARD_OPTIONS[0].url.replace("https://", "https://user:pass@"),
    GIFT_CARD_OPTIONS[0].url + "?redirect=https://evil.example",
    GIFT_CARD_OPTIONS[0].url.replace("BzdaX", "wrong")
  ]) {
    assert.equal(isGiftCardFrame(url), false);
    const f = fixture();
    f.links[0].href = url;
    f.controller.open();
    f.select();
    assert.equal(f.frames.length, 0);
    f.controller.dispose();
  }
});

test("disposing cancels work and ignores late events and clicks", () => {
  const f = fixture();
  f.controller.open();
  f.select();
  f.controller.dispose();
  assert.equal(f.timers.size, 0);
  f.load();
  f.frames[0].dispatchEvent(new Event("error"));
  f.select(1);
  assert.equal(f.frames[0].navigations.length, 1);
  assert.equal(f.get("mindbody-checkout-host").dataset.state, "loading");
});

test("published package links match verified campaign configuration", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const hrefs = [...html.matchAll(/class="gift-card-option"[^>]*href="([^"]+)"/g)].map(
    (m) => m[1]
  );
  assert.deepEqual(
    hrefs,
    GIFT_CARD_OPTIONS.map((option) => option.url)
  );
  assert.deepEqual(
    GIFT_CARD_OPTIONS.map(({ value, price }) => [value, price]),
    [
      [100, 50],
      [250, 125],
      [500, 250]
    ]
  );
  assert.equal(html.includes('data-widget-type="Pricing"'), false);
});
