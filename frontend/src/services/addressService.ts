// src/services/addressService.ts

import { IShippingAddress } from 'types/order.interface';
import { getCookie } from './getCookie';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/verify-address`;

interface VerifyAddressResponse {
  success: boolean;
  validated_address?: IShippingAddress;
  message?: string;
}

export const verifyAddress = async (
  address: IShippingAddress,
): Promise<VerifyAddressResponse> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify(address),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error verifying address:', errorData);
      throw new Error(errorData.message || 'Address verification failed.');
    }

    const data: VerifyAddressResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error verifying address:', error.message);
    throw error;
  }
};
