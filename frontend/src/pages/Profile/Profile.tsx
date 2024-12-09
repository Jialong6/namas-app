import { Button } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '@services/userService';
import { IUser } from 'types/user.interface';
import { getOrders } from '@services/orderService';
import { IOrder } from 'types/order.interface';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem
} from '@material-tailwind/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Arrow Icon
function ArrowIcon({ open }: { open: boolean }) {
  return (
    <ChevronDownIcon
      className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`}
    />
  );
}

// Order Accordion
function OrderAccordion({ order }: { order: IOrder }) {
  const [open, setOpen] = useState(false);
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleViewItem = (productId: string) => {
    window.open(`/details/${productId}`, '_blank');
  };

  return (
    <Accordion
      open={open}
      icon={<ArrowIcon open={open} />}
      key={order.order_id}
    >
      <AccordionHeader onClick={() => setOpen((cur) => !cur)}>
        {formattedDate}
      </AccordionHeader>
      <AccordionBody>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-normal">
            <span className="font-bold">ORDER ID:</span> {order.order_id}
          </div>
          <div className="text-sm font-normal">
            <span className="font-bold">TOTAL:</span> ${order.amount}
          </div>
          <div className="text-sm font-normal">
            <span className="font-bold">SHIPPING ADDRESS:</span>{' '}
            {order.shipping_address}
          </div>
          <div className="text-sm font-normal">
            <span className="font-bold">STATUS:</span> {order.status}
          </div>
          <Menu>
            <MenuHandler className="items-center">
              <Button variant="text" ripple={false} className="w-fit text-sm font-normal">View Items</Button>
            </MenuHandler>
            <MenuList>
              {order.items.map((item, index) => (
                <MenuItem key={index} onClick={() => void handleViewItem(item.product_id)}>{item.name}</MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
      </AccordionBody>
    </Accordion>
  );
}

export default function Profile() {
  const [user, setUser] = useState<IUser>({
    email: '',
    first_name: '',
    last_name: '',
  });
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        } else {
          // Show bottom alert
          window.dispatchEvent(
            new CustomEvent('show-bottom-alert', {
              detail: {
                message: 'You are not logged in.',
                timeout: 2000,
              },
            }),
          );
          // Redirect to home page if user is not authenticated
          window.location.href = '/';
        }
      } catch (error) {
        console.error(error);
        // Show bottom alert
        window.dispatchEvent(
          new CustomEvent('show-bottom-alert', {
            detail: {
              message: 'Please try login again.',
              timeout: 2000,
            },
          }),
        );
        // Redirect to home page if user is not authenticated
        window.location.href = '/';
      }
    };

    const fetchOrders = async () => {
      try {
        const orders = await getOrders();
        setOrders(orders);
      } catch (error) {
        console.error(error);
        // Show bottom alert
        window.dispatchEvent(
          new CustomEvent('show-bottom-alert', {
            detail: {
              message: 'Failed to fetch past orders.',
              timeout: 2000,
            },
          }),
        );
      }
    };

    void fetchUser();
    void fetchOrders();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      // Show bottom alert
      window.dispatchEvent(
        new CustomEvent('show-bottom-alert', {
          detail: {
            message: 'Sorry, something went wrong. Please try logout again.',
            timeout: 2000,
          },
        }),
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 place-items-center">
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-bold">
          {user.first_name} {user.last_name}
        </div>
        <div className="text-lg font-normal">{user.email}</div>
        <Button onClick={() => void handleLogout()}>Logout</Button>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Orders</h2>
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderAccordion order={order} key={order.order_id} />
          ))
        ) : (
          <div className="text-center text-lg font-normal">No orders found.</div>
        )}
      </div>
    </div>
  );
}
