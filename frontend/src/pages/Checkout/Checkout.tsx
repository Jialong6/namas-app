// src/pages/Checkout/Checkout.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import AddressForm from './AddressForm';
import {
  Card,
  CardBody,
  Typography,
  CardFooter,
  Menu,
  MenuList,
  MenuItem,
  MenuHandler,
  Button,
} from '@material-tailwind/react';
import { ICartItem } from 'types/cart.interface';
import { IShippingAddress } from 'types/order.interface';
import { TrashIcon } from '@heroicons/react/24/outline';
import AmountInputArea from '../../components/AmountInputArea';
import { getCart, updateCart } from '../../services/cartService';
import { createPayment } from '../../services/paymentService';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
);

interface CheckoutItemProps {
  item: ICartItem;
  onCartUpdate: () => void;
}

const CheckoutItem = ({ item, onCartUpdate }: CheckoutItemProps) => {
  const [totalPrice, setTotalPrice] = useState(item.price * item.quantity);

  const handleRemoveItem = async () => {
    try {
      const cart = await getCart();
      const updatedCart = cart.filter((i) => i.product_id !== item.product_id);
      await updateCart(updatedCart);
      onCartUpdate();
    } catch (err) {
      console.error('Error removing item from cart:', err);
      window.dispatchEvent(
        new CustomEvent('show-bottom-alert', {
          detail: {
            message: 'Failed to remove item from cart',
            timeout: 2000,
          },
        }),
      );
    }
  };

  const handleUpdateQuantity = async (value: number) => {
    try {
      const cart = await getCart();
      const updatedCart = cart.map((i) =>
        i.product_id === item.product_id ? { ...i, quantity: value } : i,
      );
      await updateCart(updatedCart);
      setTotalPrice(item.price * value);
      onCartUpdate();
    } catch (err) {
      console.error('Error updating quantity:', err);
      window.dispatchEvent(
        new CustomEvent('show-bottom-alert', {
          detail: {
            message: 'Failed to update quantity',
            timeout: 2000,
          },
        }),
      );
    }
  };

  return (
    <Card className="relative">
      <CardBody className="pb-3">
        <Typography variant="h4" className="font-bold text-blue-gray-800">
          {item.name.toUpperCase()}
        </Typography>
        <Typography variant="h6">Unit Price: ${item.price}</Typography>
        <button
          className="absolute right-5 top-5 rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all hover:bg-slate-800 hover:text-red-500 hover:border-red-500 active:bg-red-500 active:text-white"
          type="button"
          onClick={() => void handleRemoveItem()}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
        {item.beads && item.beads.length > 0 && (
          <Menu>
            <MenuHandler>
              <Button variant="outlined" ripple={false} size="sm">
                Show Selected Beads
              </Button>
            </MenuHandler>
            <MenuList className="z-[9999] overflow-y-auto max-h-[200px]">
              {item.beads.map((bead, index) => (
                <MenuItem key={index}>
                  <div className="flex items-center gap-2">
                    <img
                      src={bead.imgPath}
                      alt={bead.name}
                      className="w-8 h-8 rounded-md"
                    />
                    <span>{bead.name}</span>
                  </div>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
      </CardBody>
      <CardFooter className="pt-0 flex flex-col gap-3">
        <AmountInputArea
          min={1}
          max={item.inventory}
          defaultValue={item.quantity}
          onChange={(value) => void handleUpdateQuantity(value)}
        />
        <Typography variant="h6">Price: ${totalPrice.toFixed(2)}</Typography>
      </CardFooter>
    </Card>
  );
};

// Helper function to calculate cart total
const getCartTotal = (items: ICartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const CheckoutContent = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cartEmpty, setCartEmpty] = useState<boolean>(false);
  const [items, setItems] = useState<ICartItem[]>([]);
  const [shippingAddress, setShippingAddress] =
    useState<IShippingAddress | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await getCart();
        setItems(cart);
        if (cart.length === 0) {
          setCartEmpty(true);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        navigate('/');
      }
    };

    void loadCart();
  }, [navigate]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!shippingAddress || items.length === 0) {
        return;
      }
      try {
        const clientSecret = await createPayment(items, shippingAddress);
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        window.dispatchEvent(
          new CustomEvent('show-bottom-alert', {
            detail: {
              message: 'Error Checking Out! Please try again later.',
              timeout: 2000,
            },
          }),
        );
      }
    };

    void createPaymentIntent();
  }, [shippingAddress, items]);

  const handleAddressSubmit = (address: IShippingAddress | null) => {
    setShippingAddress(address);
  };

  const handleCartUpdate = async () => {
    try {
      const cart = await getCart();
      setItems(cart);
      if (cart.length === 0) {
        setCartEmpty(true);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  if (cartEmpty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Your cart is empty!</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      {/* Cart Items */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto p-4 pb-20">
          {items.map((item) => (
            <CheckoutItem
              key={item.product_id}
              item={item}
              onCartUpdate={() => void handleCartUpdate()}
            />
          ))}
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <Elements stripe={stripePromise}>
          <AddressForm onAddressChange={handleAddressSubmit} />
        </Elements>
      </div>

      {/* Total Price */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Total: ${getCartTotal(items).toFixed(2)}
        </h2>
      </div>

      {/* Payment Section */}
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <CheckoutForm shippingAddress={shippingAddress} />
          </div>
        </Elements>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <p className="text-gray-600">
            Please provide your shipping address to proceed.
          </p>
        </div>
      )}
    </div>
  );
};

const Checkout = () => {
  return <CheckoutContent />;
};

export default Checkout;
