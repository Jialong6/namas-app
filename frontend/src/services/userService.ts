import {
  IUser,
  IRegistration,
  IResponse,
  IUserResponse,
  ILogin,
} from '../types/user.interface';
import { getCookie } from './getCookie';

/**
 * Get the CSRF token
 * @returns {Promise<string>} The CSRF token
 */
export async function fetchCsrfToken(): Promise<void> {
  try {
    // Make a GET request to Django to get the CSRF cookie
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf`, {
      method: 'GET',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
}

/**
 * Get the current user
 * @returns {Promise<IUser | null>} The current user or null if not authenticated
 */
export const getCurrentUser = async (): Promise<IUser | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/account/user`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = (await response.json()) as IUserResponse;

    if (!response.ok) {
      console.error('Failed to get current user:', data.message);
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

export const updateUser = (user: IUser): Promise<IUser> => {
  return new Promise((resolve) => {
    resolve(user);
  });
};

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/account/logout`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      },
    );

    if (!response.ok) {
      console.error(response);
      throw new Error('Failed to logout');
    }
    return;
  } catch (error) {
    console.error('Failed to logout:', error);
    throw new Error('Failed to logout');
  }
};

/**
 * Login a user
 * @param {ILogin} userData - The user data to login
 * @returns {Promise<IResponse>} The login response
 */
export const login = async (credentials: ILogin): Promise<IResponse> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/account/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      },
    );

    const data = (await response.json()) as IResponse;

    if (!response.ok) {
      console.error('Failed to login:', data.message);
      return data;
    }

    return data;
  } catch (error) {
    console.error('Failed to login:', error);
    return {
      success: false,
      message: 'Login failed. Please try again.',
      errors: null,
    } as IResponse;
  }
};

/**
 * Register a new user
 * @param {IRegistration} userData - The user data to register
 * @returns {Promise<IResponse>} The registration response
 */
export const register = async (userData: IRegistration): Promise<IResponse> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/account/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      },
    );

    const data = (await response.json()) as IResponse;

    if (!response.ok) {
      console.error('Failed to register:', data.message);
      return data;
    }

    return data;
  } catch (error) {
    console.error('Failed to register:', error);
    return {
      success: false,
      message: 'Registration failed. Please try again.',
      errors: null,
    } as IResponse;
  }
};
