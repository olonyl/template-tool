export interface PriceRow {
  label: string;
  before: string;
  after: string;
}

export interface PromoInput {
  profile?: "taller";
  variant: "meta" | "gbp";
  title: string;
  badge: string;
  validText: string;
  prices: PriceRow[];
  phone: string;
  /** Background image as a data: URL (uploaded by the user, never stored on disk) */
  imageDataUrl: string;
}

export interface ChikiTechInput {
  profile: "chikitech";
  model: string;
  specs: string[];
  giftBadge: string;
  price: string;
  phone: string;
  /** Product cutout as a data: URL, ideally with a transparent background */
  imageDataUrl: string;
}

export type RenderPayload = PromoInput | ChikiTechInput;
