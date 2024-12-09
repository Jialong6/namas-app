import { IBead } from 'types/customize.interface';

export interface IProduct {
  product_id: string;
  name: string;
  images: string[];
  price: number;
  category: string;
  description: string;
  inventory: number;
  rating: number | null;
  beads: IBead[];
}

export interface IProductResponse {
  success: boolean;
  products: IProduct[];
}

export interface IProductDetailsResponse {
  success: boolean;
  product: IProduct;
}

export interface IPageCountResponse {
  success: boolean;
  pages: number;
}
