import { IBead } from 'types/customize.interface';

export interface ICartItem {
  product_id: string;
  name: string;
  quantity: number;
  inventory: number;
  price: number;
  category?: string;
  images?: string[];
  beads?: IBead[];
}

export interface ICartResponse {
  success: boolean;
  cart_items: ICartItem[];
  messages?: string[];
}
