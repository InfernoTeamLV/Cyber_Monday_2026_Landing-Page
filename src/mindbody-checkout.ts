import { isGiftCardFrame } from "./gift-card-options.ts";

export const CHECKOUT_TIMEOUT = 15000;

type CheckoutDependencies = {
  schedule: (callback: () => void, delay: number) => ReturnType<typeof setTimeout>;
  cancel: (handle: ReturnType<typeof setTimeout>) => void;
};

/** Embed Mindbody's official purchase pages, never its new-tab widget launcher. */
export function createGiftCardCheckout(
  root: Document,
  dependencies: CheckoutDependencies = {
    schedule: (callback, delay) => setTimeout(callback, delay),
    cancel: (handle) => clearTimeout(handle)
  }
): { open: () => void; dispose: () => void } | null {
  const panel = root.getElementById("gift-card-checkout");
  const offer = root.getElementById("gift-card-offer");
  const section = root.getElementById("offer");
  const trigger = root.querySelector<HTMLAnchorElement>(".gift-button");
  const options = root.getElementById("checkout-options");
  const links = [...root.querySelectorAll<HTMLAnchorElement>(".gift-card-option")];
  const back = root.getElementById("checkout-back");
  const resume = root.getElementById("checkout-resume");
  const retry = root.getElementById("checkout-retry");
  const hosted = root.getElementById("checkout-hosted");
  const status = root.getElementById("checkout-status");
  const recovery = root.getElementById("checkout-recovery");
  const host = root.getElementById("mindbody-checkout-host");
  if (
    !panel ||
    !offer ||
    !section ||
    !trigger ||
    !options ||
    !back ||
    !resume ||
    !retry ||
    !hosted ||
    !status ||
    !recovery ||
    !host ||
    links.length === 0
  )
    return null;

  let frame: HTMLIFrameElement | null = null;
  let selectedUrl: string | null = null;
  let state: "idle" | "loading" | "ready" | "error" = "idle";
  let deadline: ReturnType<typeof setTimeout> | undefined;
  let focusWhenReady = false;
  let policyBlocked = false;
  let disposed = false;

  const stopWaiting = () => {
    if (deadline !== undefined) dependencies.cancel(deadline);
    deadline = undefined;
  };
  const setCloseLabel = (label: string) => {
    back.setAttribute("aria-label", label);
    back.setAttribute("title", label);
  };
  const fail = () => {
    if (disposed) return;
    stopWaiting();
    state = "error";
    focusWhenReady = false;
    host.dataset.state = state;
    host.setAttribute("aria-busy", "false");
    status.textContent = "Checkout couldn’t load. Try again or open Mindbody below.";
    status.hidden = host.hidden;
    recovery.hidden = host.hidden;
  };
  const onLoad = () => {
    if (disposed || policyBlocked) return;
    // This event reveals a vendor page; it never confirms a purchase.
    stopWaiting();
    state = "ready";
    host.dataset.state = state;
    host.setAttribute("aria-busy", "false");
    status.hidden = true;
    recovery.hidden = true;
    if (focusWhenReady && !panel.hidden && !host.hidden && root.activeElement === back)
      frame?.focus();
    focusWhenReady = false;
  };
  const onPolicyViolation = (event: SecurityPolicyViolationEvent) => {
    if (!selectedUrl || event.effectiveDirective !== "frame-src") return;
    try {
      if (new URL(event.blockedURI).origin !== new URL(selectedUrl).origin) return;
      policyBlocked = true;
      fail();
    } catch {
      // Reports for other resource types or opaque origins are unrelated.
    }
  };
  const showFrame = () => {
    options.hidden = true;
    host.hidden = false;
    setCloseLabel("Close checkout");
    status.hidden = state !== "loading" && state !== "error";
    recovery.hidden = state !== "error";
    if (state === "ready") frame?.focus();
    else back.focus();
  };
  const start = () => {
    if (!selectedUrl || disposed) return;
    stopWaiting();
    policyBlocked = false;
    state = "loading";
    host.dataset.state = state;
    host.setAttribute("aria-busy", "true");
    status.textContent = "Loading secure checkout…";
    status.hidden = false;
    recovery.hidden = true;
    focusWhenReady = true;
    hosted.setAttribute("href", selectedUrl);
    showFrame();
    deadline = dependencies.schedule(fail, CHECKOUT_TIMEOUT);
    if (!frame) {
      frame = root.createElement("iframe");
      frame.id = "mindbody-checkout-frame";
      frame.name = "mindbody-checkout";
      frame.title = "Mindbody gift card checkout";
      frame.setAttribute("allow", "payment");
      frame.addEventListener("load", onLoad);
      frame.addEventListener("error", fail);
      frame.src = selectedUrl;
      host.append(frame);
    } else frame.src = selectedUrl;
  };
  const onSelect = (event: MouseEvent) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    const link = event.currentTarget as HTMLAnchorElement;
    if (disposed || !isGiftCardFrame(link.href)) return;
    resume.hidden = false;
    if (selectedUrl === link.href) {
      showFrame();
      return;
    }
    selectedUrl = link.href;
    start();
  };
  const onResume = () => {
    if (selectedUrl && !disposed) showFrame();
  };
  const onRetry = () => start();
  const onClose = () => {
    panel.hidden = true;
    host.hidden = true;
    options.hidden = false;
    status.hidden = true;
    recovery.hidden = true;
    focusWhenReady = false;
    setCloseLabel("Close gift cards");
    offer.inert = false;
    offer.removeAttribute("aria-hidden");
    section.setAttribute("aria-labelledby", "offer-title");
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  };
  for (const link of links) link.addEventListener("click", onSelect);
  back.addEventListener("click", onClose);
  retry.addEventListener("click", onRetry);
  resume.addEventListener("click", onResume);
  root.addEventListener("securitypolicyviolation", onPolicyViolation);
  return {
    open: () => {
      if (disposed || !panel.hidden) return;
      offer.inert = true;
      offer.setAttribute("aria-hidden", "true");
      panel.hidden = false;
      section.setAttribute("aria-labelledby", "checkout-title");
      trigger.setAttribute("aria-expanded", "true");
      back.focus();
    },
    dispose: () => {
      disposed = true;
      stopWaiting();
      frame?.removeEventListener("load", onLoad);
      frame?.removeEventListener("error", fail);
      for (const link of links) link.removeEventListener("click", onSelect);
      back.removeEventListener("click", onClose);
      retry.removeEventListener("click", onRetry);
      resume.removeEventListener("click", onResume);
      root.removeEventListener("securitypolicyviolation", onPolicyViolation);
    }
  };
}
