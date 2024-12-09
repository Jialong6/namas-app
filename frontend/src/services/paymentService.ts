import { ICartItem } from 'types/cart.interface';
import { IShippingAddress } from 'types/order.interface';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { getCookie } from './getCookie';

export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const createPayment = async (
  items: ICartItem[],
  shippingAddress: IShippingAddress,
): Promise<string> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/checkout/create-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ items, shippingAddress }),
      },
    );

    if (!response.ok) {
      console.error('Error fetching client secret:', response.statusText);
      throw new Error('Error fetching client secret');
    }

    const { clientSecret } = (await response.json()) as {
      clientSecret: string;
    };
    return clientSecret;
  } catch (error: any) {
    console.error('Error creating payment intent:', error.message);
    throw error;
  }
};
