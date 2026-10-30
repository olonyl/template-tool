export interface PriceRow {
  label: string;
  before: string;
  after: string;
}

export interface PromoInput {
  variant: "meta" | "gbp";
  title: string;
  badge: string;
  validText: string;
  prices: PriceRow[];
  phone: string;
  /** Background image as a data: URL (uploaded by the user, never stored on disk) */
  imageDataUrl: string;
}
