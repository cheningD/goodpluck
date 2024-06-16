import type { CartItemSnake } from "node_modules/swell-js/types/cart/snake";
import type { Cart, Category, Product, Subscription } from "swell-js";
import type { Session, User } from "./stytch_types_b2c";

interface GoodpluckVendor {
  name: string;
}

export interface GoodpluckCartItem extends Omit<CartItemSnake, "product"> {
  product: GoodpluckProduct;
}

export interface GoodpluckCart extends Omit<Cart, "items"> {
  delivery_date?: string;
  ordering_window_start_date?: string; // Monday to Thursday
  ordering_window_end_date?: string; // Friday
  order_charge_date?: string; // Sunday or Monday
  name: string;
  items: GoodpluckCartItem[];
}

export interface WeightOption {
  id: string;
  name: string;
}

export interface GoodpluckProduct extends Omit<Product, "id"> {
  unit_quantity: number;
  unit: string;
  id: string;
  vendor: GoodpluckVendor;
}

export interface GoodpluckProductFromCategory extends Omit<Product, "id"> {
  unit_quantity: number;
  unit: string;
  product_id: string;
}

interface ProductExpansion {
  count: number;
  results: GoodpluckProductFromCategory[];
}

export interface GoodpluckCategory extends Omit<Category, "products"> {
  products: ProductExpansion;
  id: string;
  top_id: string;
  isActive?: boolean;
  subcategories: GoodpluckCategory[];
}

export interface GoodpluckSubscription extends Subscription {
  delivery_preferences?: string;
}

export interface GoodpluckAuthResp {
  message?: string;
  isLoggedInStytch: boolean;
  session?: Session;
  user?: User;
}
