import type { CartItemSnake } from "node_modules/swell-js/types/cart/snake";
import type { Cart, Category, Product, Subscription } from "swell-js";

interface GoodpluckVendor {
  name: string;
}

export interface GoodpluckCartItem extends Omit<CartItemSnake, "product"> {
  product: GoodpluckProduct;
}

export interface GoodpluckCart extends Omit<Cart, "items"> {
  delivery_date?: string;
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
}

export interface GoodpluckSubscription extends Subscription {
  delivery_preferences?: string;
}
