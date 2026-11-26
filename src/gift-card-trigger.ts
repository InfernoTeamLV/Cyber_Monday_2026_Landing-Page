type Checkout = { open: () => void };
type CheckoutModule = { createGiftCardCheckout: (root: Document) => Checkout | null };

/** Keep checkout code and every vendor request off the initial rendering path. */
export function bindGiftCardButton(
  root: Document,
  loadCheckout: () => Promise<CheckoutModule> = () => import("./mindbody-checkout.ts"),
  openHosted: (url: string) => void = (url) => root.defaultView?.location.assign(url)
): void {
  const trigger = root.querySelector<HTMLAnchorElement>(".gift-button");
  if (!trigger) return;
  let checkout: Checkout | null = null;
  let pending = false;
  trigger.setAttribute("aria-controls", "gift-card-checkout");
  trigger.setAttribute("aria-expanded", "false");
  trigger.addEventListener("click", async (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    if (pending) return;
    pending = true;
    trigger.setAttribute("aria-busy", "true");
    try {
      checkout ??= (await loadCheckout()).createGiftCardCheckout(root);
      if (!checkout) throw new Error("Checkout markup is unavailable.");
      checkout.open();
    } catch {
      // A failed local chunk still leaves the explicitly requested purchase reachable.
      openHosted(trigger.href);
    } finally {
      pending = false;
      trigger.removeAttribute("aria-busy");
    }
  });
}
