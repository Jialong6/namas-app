/*
 * Cart-Related Utility Functions (DEPRECATED)
 * These functions use local storage to store the cart items.
 * Deprecated because we are connecting to the backend to store the cart items now.
 */

// import { ICartItem } from 'types/cart.interface';

// // Get the cart from local storage
// export function getCart(): ICartItem[] {
//   const cartItem = localStorage.getItem('cart');
//   let cart: ICartItem[] = [];
//   try {
//     if (cartItem) {
//       cart = JSON.parse(cartItem) as ICartItem[];
//     }
//   } catch (error) {
//     console.error('Error parsing cart:', error);
//   }
//   return cart;
// }

// // Save the cart to local storage
// export function saveCart(cart: ICartItem[]): void {
//   localStorage.setItem('cart', JSON.stringify(cart));
// }

// // Get the total price of the cart
// export function getCartTotal(): number {
//   return getCart().reduce(
//     (total, item) => total + item.price * item.quantity,
//     0,
//   );
// }

// // Add an item to the cart
// export function addItemToCart(item: ICartItem): void {
//   if (item.quantity < 1 || item.quantity > item.max_quantity) return;

//   const cart = getCart();
//   const existingItem = cart.find((i) => i.product_id === item.product_id);

//   if (existingItem) {
//     updateItemQuantity(item.product_id, item.quantity + existingItem.quantity);
//   } else {
//     cart.push(item);
//     saveCart(cart);
//   }
// }

// // Update the quantity of an item in the cart
// export function updateItemQuantity(productId: string, quantity: number): void {
//   const cart = getCart();
//   const item = cart.find((i) => i.product_id === productId);

//   if (!item || quantity < 1 || quantity > item.max_quantity) return;

//   const updatedCart = cart.map((i) =>
//     i.product_id === productId ? { ...i, quantity } : i,
//   );
//   saveCart(updatedCart);
// }

// // Remove an item from the cart
// export function removeItemFromCart(item: ICartItem): void {
//   const cart = getCart();
//   const updatedCart = cart.filter((i) => i.product_id !== item.product_id);
//   saveCart(updatedCart);
// }
