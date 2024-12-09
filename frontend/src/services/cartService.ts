import { ICartItem, ICartResponse } from 'types/cart.interface';
import { getCookie } from './getCookie';
/**
 * Get the current user's cart from backend
 * @returns The cart
 */
export async function getCart(): Promise<ICartItem[]> {
  const url = `${import.meta.env.VITE_BACKEND_URL}/cart`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  });

  const data = (await response.json()) as ICartResponse;
  if (!response.ok) {
    throw new Error(data.messages?.[0] ?? 'Failed to get cart');
  }
  return data.cart_items;
}

/**
 * Send update cart request to backend
 * @param cartItems - The cart items to update
 * @returns The updated cart items
 */
export async function updateCart(cartItems: ICartItem[]): Promise<ICartItem[]> {
  const url = `${import.meta.env.VITE_BACKEND_URL}/cart`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({ cart_items: cartItems }),
  });

  const data = (await response.json()) as ICartResponse;
  if (!response.ok) {
    throw new Error(data.messages?.[0] ?? 'Failed to update cart');
  }
  return data.cart_items;
}
