import { ICartItem } from 'types/cart.interface';

export interface IShippingAddress {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  email?: string;
}

export interface IOrder {
  order_id: string;
  user: number;
  amount: string;
  shipping_address: string;
  status: string;
  created_at: string;
  items: ICartItem[];
}

export interface ICheckoutResponse {
  success: boolean;
  order: IOrder;
}

export interface IOrdersResponse {
  success: boolean;
  orders: IOrder[];
}
