// Matched to the supplied Mindbody Pricing widget on November 25, 2026.
// Mindbody remains authoritative for current prices, eligibility and payment.
const businessId = "bus_11AXjPEx2ki2C6Zu1";
export const GIFT_CARD_OPTIONS = [
  { value: 100, price: 50, id: "po_11AXjPEx2ki2BzdaX" },
  { value: 250, price: 125, id: "po_11AXjPEx2ki2BzdbY" },
  { value: 500, price: 250, id: "po_11AXjPEx2ki2BzdcZ" }
].map((option) => ({
  ...option,
  url: `https://go.mindbodyonline.com/book/app/pricing/${businessId}/${option.id}`
}));

export function isGiftCardFrame(url: string): boolean {
  try {
    const candidate = new URL(url);
    return GIFT_CARD_OPTIONS.some((option) => candidate.href === option.url);
  } catch {
    return false;
  }
}
