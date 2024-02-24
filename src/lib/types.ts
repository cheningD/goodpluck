import type { Cart } from "swell-js";

export interface GoodpluckCart extends Cart {
  date_delivery?: string;
}

export interface WeightOption {
  id: string;
  name: string;
}
