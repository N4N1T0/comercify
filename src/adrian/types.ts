export type CalculateSavings = {
  amountSaved: number;
  percentSaved: number;
};

export type SimpleDiscount = {
  type: 'percentage' | 'fixed';
  amount: number; // percentage (e.g. 20) or fixed amount
  minSubtotal?: number;
  expiresAt?: Date;
};

export type CartItem = {
  productId: string;
  quantity: number;
  [key: string]: string | number; // extra metadata such as name, price or variant
};

export type FormatPriceOptions = {
  currency?: string; // ISO 4217 code, e.g. 'EUR' or 'USD'
  locale?: string; // BCP 47 tag, e.g. 'de-DE' or 'en-US'
};

export type TaxBreakdown = {
  net: number;
  tax: number;
  gross: number;
};

export type PricedCartItem = CartItem & {
  price: number; // unit price
};

export type ShippingRule = {
  flatRate: number; // cost when the order does not qualify for free shipping
  freeThreshold?: number; // subtotal from which shipping is free
};

export type FreeShippingProgress = {
  qualified: boolean;
  remaining: number; // amount left to reach the threshold
  percent: number; // 0 to 100, for a progress bar
};

export type BestDiscount = {
  discount: SimpleDiscount | null; // null when none of them applies
  total: number;
  savings: number;
};

export type InviteCodeOptions = {
  length?: number; // characters of the random part (default 8)
  prefix?: string; // prepended as is, e.g. 'WELCOME-'
  alphabet?: string; // characters to draw from
};

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type StockStatusOptions = {
  lowStockThreshold?: number; // units at or below which stock counts as low (default 5)
};

export type SkuOptions = {
  separator?: string; // between parts (default '-')
  maxPartLength?: number; // truncate each part to this many characters
};
