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
