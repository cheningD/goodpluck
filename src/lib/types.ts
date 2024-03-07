import type { Cart } from "swell-js";

export interface GoodpluckCart extends Cart {
  delivery_date?: string;
}

export interface WeightOption {
  id: string;
  name: string;
}
