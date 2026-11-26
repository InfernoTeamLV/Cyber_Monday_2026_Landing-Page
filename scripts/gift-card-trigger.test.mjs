import assert from "node:assert/strict";
import test from "node:test";
import { bindGiftCardButton } from "../src/gift-card-trigger.ts";

function fixture(load) {
  const listeners = new Map();
  const attributes = new Map();
  const navigations = [];
  const trigger = {
    href: "https://go.mindbodyonline.com/book/widgets/pricing/view/c5732322c8/pricing",
    setAttribute: (key, value) => attributes.set(key, value),
    removeAttribute: (key) => attributes.delete(key),
    addEventListener: (type, fn) => listeners.set(type, fn)
  };
  const root = { querySelector: () => trigger };
  bindGiftCardButton(root, load, (url) => navigations.push(url));
  return {
    trigger,
    attributes,
    navigations,
    click: (extra = {}) =>
      listeners.get("click")({ button: 0, preventDefault() {}, ...extra })
  };
}

test("checkout code is lazy and its controller is reused after reopening", async () => {
  let loads = 0,
    opens = 0;
  const f = fixture(async () => {
    loads++;
    return { createGiftCardCheckout: () => ({ open: () => opens++ }) };
  });
  assert.equal(loads, 0);
  await f.click();
  await f.click();
  assert.equal(loads, 1);
  assert.equal(opens, 2);
  assert.equal(f.navigations.length, 0);
  assert.equal(f.attributes.has("aria-busy"), false);
});

test("duplicate clicks during a chunk load open only one checkout", async () => {
  let finish,
    opens = 0,
    loads = 0;
  const f = fixture(() => {
    loads++;
    return new Promise((resolve) => {
      finish = resolve;
    });
  });
  const first = f.click();
  await f.click();
  finish({ createGiftCardCheckout: () => ({ open: () => opens++ }) });
  await first;
  assert.equal(loads, 1);
  assert.equal(opens, 1);
});

test("modified clicks preserve native hosted checkout navigation", async () => {
  const f = fixture(() => assert.fail("must not load a chunk"));
  for (const modifier of [
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 }
  ])
    await f.click({
      ...modifier,
      preventDefault: () => assert.fail("must not prevent native navigation")
    });
  assert.deepEqual(f.navigations, []);
});

test("a failed chunk or missing checkout markup opens the verified hosted destination", async () => {
  for (const load of [
    async () => {
      throw new Error("network");
    },
    async () => ({ createGiftCardCheckout: () => null })
  ]) {
    const f = fixture(load);
    await f.click();
    assert.deepEqual(f.navigations, [f.trigger.href]);
    assert.equal(f.attributes.has("aria-busy"), false);
  }
});
