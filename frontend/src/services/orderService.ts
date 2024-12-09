import {
  ICheckoutResponse,
  IShippingAddress,
  IOrdersResponse,
  IOrder,
} from 'types/order.interface';
import { getCookie } from './getCookie';

/**
 * Send checkout request to backend
 * @returns The checkout response
 */
export async function checkout(
  address: IShippingAddress,
): Promise<ICheckoutResponse> {
  // Format the shipping address
  const shippingAddress = `${address.streetAddress}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
  // Send checkout request to backend
  const url = `${import.meta.env.VITE_BACKEND_URL}/checkout`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({ shipping_address: shippingAddress }),
  });

  // Check if the response is ok
  if (!response.ok) {
    throw new Error(`Checkout failed: ${response.statusText}`);
  }

  const data = (await response.json()) as ICheckoutResponse;

  // Return the response
  return data;
}

/**
 * Get all orders for the current user
 * @returns The orders
 */
export async function getOrders(): Promise<IOrder[]> {
  const url = `${import.meta.env.VITE_BACKEND_URL}/orders`;
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    },
  });

  if (!response.ok) {
    throw new Error(`Get orders failed: ${response.statusText}`);
  }

  const data = (await response.json()) as IOrdersResponse;

  return data.orders;
}
