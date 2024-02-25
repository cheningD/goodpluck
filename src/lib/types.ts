import type { CartItemSnake } from "node_modules/swell-js/types/cart/snake";
import type { Cart, Product } from "swell-js";

export interface GoodpluckCart extends Cart {
  orderingWindowStartDate?: Date;
  orderingWindowEndDate?: Date;
  orderChargeDate?: Date;
  delivery_date?: Date;
}

export interface GoodpluckProduct extends Product {
  vendor: {
    first_name: string;
  };
}
export interface GoodpluckCartItem extends CartItemSnake {
  image: string;
  product: GoodpluckProduct;
}
