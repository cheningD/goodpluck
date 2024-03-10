import type { Cart, Category, Product } from "swell-js";

export interface GoodpluckCart extends Cart {
  delivery_date?: string;
}

export interface WeightOption {
  id: string;
  name: string;
}

export interface GoodpluckProduct extends Product {
  unit_quantity: number;
  unit: string;
  product_id: string;
}

interface ProductExpansion {
  count: number;
  results: GoodpluckProduct[];
}

export interface GoodpluckCategory extends Omit<Category, "products"> {
  products: ProductExpansion;
  id: string;
  top_id: string;
}
