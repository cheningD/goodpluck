import type { Cart, Category, Product } from "swell-js";

export interface GoodpluckCart extends Cart {
  delivery_date?: string;
}

export interface WeightOption {
  id: string;
  name: string;
}

export interface GoodpluckProduct extends Omit<Product, "id"> {
  unit_quantity: number;
  unit: string;
  id: string;
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
