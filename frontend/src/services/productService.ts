import {
  IProduct,
  IProductResponse,
  IProductDetailsResponse,
  IPageCountResponse,
} from '../types/product.interface';
import { getCookie } from './getCookie';

/**
 * Add backend address to product images
 */
const addBackendUrlToProductImages = (product: IProduct): IProduct => {
  return {
    ...product,
    images: product.images.map(
      (image) => `${import.meta.env.VITE_BACKEND_URL}${image}`,
    ),
  };
};

/**
 * Fetches products from the backend API based on provided filters.
 * @param type - The type of products (e.g., 'bracelet', 'necklace', 'ring', 'bead').
 * @param sortBy - Field to sort products by (e.g., 'price', 'created_at', 'sales_count').
 * @param orderBy - Order of sorting (e.g., 'asc', 'desc').
 * @param priceMin - Minimum price filter.
 * @param priceMax - Maximum price filter.
 * @returns A list of products with updated image URLs.
 */
export const getProducts = async (
  type: 'bracelet' | 'necklace' | 'ring' | 'bead' | null = null,
  sortBy: 'price' | 'created_at' | 'sales_count' | null = null,
  orderBy: 'asc' | 'desc' | null = null,
  priceMin: number | null = null,
  priceMax: number | null = null,
  page: number = 1,
): Promise<IProduct[]> => {
  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/products`;
  // Construct URL parameters
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (sortBy) params.append('sort_by', sortBy);
  if (orderBy) params.append('order', orderBy);
  if (priceMin !== null) params.append('price_min', priceMin.toString());
  if (priceMax !== null) params.append('price_max', priceMax.toString());
  if (page) params.append('page', page.toString());

  const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to get products: ${response.statusText}`);
  }

  const data = (await response.json()) as IProductResponse;

  // Map products to include backend image URLs if not in production
  return import.meta.env.VITE_PROD
    ? data.products
    : data.products.map(addBackendUrlToProductImages);
};

/**
 * Fetches a single product details from the backend API.
 * @param productId - The ID of the product to fetch.
 * @returns A single product.
 */
export const getProductDetails = async (
  productId: string,
): Promise<IProduct> => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/products?product_id=${productId}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get product details: ${response.statusText}`);
  }

  const product = (await response.json()) as IProductDetailsResponse;
  return import.meta.env.VITE_PROD
    ? product.product
    : addBackendUrlToProductImages(product.product);
};

/**
 * Fetches the total number of pages from the backend API based on provided filters.
 * @param type - The type of products (e.g., 'bracelet', 'necklace', 'ring', 'bead').
 * @param priceMin - Minimum price filter.
 * @param priceMax - Maximum price filter.
 * @returns The total number of pages.
 */
export const getTotalPages = async (
  type: 'bracelet' | 'necklace' | 'ring' | 'bead' | null = null,
  priceMin: number | null = null,
  priceMax: number | null = null,
): Promise<number> => {
  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/products/page-count`;
  // Construct URL parameters
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (priceMin !== null) params.append('price_min', priceMin.toString());
  if (priceMax !== null) params.append('price_max', priceMax.toString());

  const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get total pages: ${response.statusText}`);
  }

  const data = (await response.json()) as IPageCountResponse;
  return data.pages;
};
