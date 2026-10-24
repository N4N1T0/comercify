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
