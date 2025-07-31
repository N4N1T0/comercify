export type CalculateSavings = {
  amountSaved: number;
  percentSaved: number;
};

export type SimpleDiscount = {
  type: 'percentage' | 'fixed';
  amount: number; // porcentaje (ej: 20) o cantidad fija
  minSubtotal?: number;
  expiresAt?: Date;
};

export type CartItem = {
  productId: string;
  quantity: number;
  [key: string]: string | number; // metadatos adicionales como nombre, precio, variante, etc.
};
