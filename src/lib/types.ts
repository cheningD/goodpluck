import type { Cart } from "swell-js";

export interface GoodpluckCart extends Cart {
  orderingWindowStartDate?: Date;
  orderingWindowEndDate?: Date;
  orderChargeDate?: Date;
  delivery_date?: Date;
}
