import {
  Drawer,
  Button,
  Typography,
  IconButton,
  Card,
  CardBody,
  CardFooter,
  Menu,
  MenuItem,
  MenuHandler,
  MenuList,
} from '@material-tailwind/react';
import AmountInputArea from './AmountInputArea';
import { ICartItem } from 'types/cart.interface';
import { getCart, updateCart } from '@services/cartService';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CartItem({ item }: { item: ICartItem }) {
  const [totalPrice, setTotalPrice] = useState(item.price * item.quantity);

  const handleRemoveItem = async () => {
    try {
      const cart = await getCart();
      const updatedCart = cart.filter((i) => i.product_id !== item.product_id);
      await updateCart(updatedCart);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error('Error removing item from cart:', err);
      // Show bottom alert
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
    } catch (err) {
      console.error('Error updating quantity:', err);
      // Show bottom alert
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
    <Card>
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
          onChange={(value: number) => void handleUpdateQuantity(value)}
        />
        <Typography variant="h6">Price: ${totalPrice.toFixed(2)}</Typography>
      </CardFooter>
    </Card>
  );
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Load cart items whenever cart changes
  useEffect(() => {
    const handleCartUpdate = async () => {
      try {
        const cart = await getCart();
        setCartItems(cart);
        setOpen(true);
      } catch (error) {
        console.error('Failed to get cart:', error);
        window.dispatchEvent(new Event('show-auth-dialog'));
      }
    };

    // Initial load
    const initialLoad = async () => {
      try {
        const cart = await getCart();
        setCartItems(cart);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };
    void initialLoad();

    // Disable body scroll when cart is open
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    // Listen for cart changes
    window.addEventListener('cart-updated', () => void handleCartUpdate());

    // Cleanup listener and body scroll
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('cart-updated', () => void handleCartUpdate());
    };
  }, [open, setOpen]);

  return (
    <>
      <Drawer
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
        overlayProps={{
          className:
            'fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9995]',
        }}
        size={500}
        className="p-4 h-[100dvh] flex flex-col"
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            CART
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <Typography variant="h6" color="blue-gray" className="mb-5">
              Your cart is empty.
            </Typography>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items flex flex-col gap-2 mb-6">
                {cartItems.map((item) => (
                  <CartItem key={item.product_id} item={item} />
                ))}
              </div>

              {/* Checkout Button */}
              <div className="flex gap-2 justify-center">
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => {
                    setOpen(false);
                    navigate('/checkout');
                  }}
                >
                  Check Out
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
}
