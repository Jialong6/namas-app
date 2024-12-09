import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
} from '@material-tailwind/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { getProductDetails } from '@services/productService';
import ProductCarousel from '@components/ProductCarousel';
import { IProduct } from 'types/product.interface';
import AmountInputArea from '@components/AmountInputArea';
import { ICartItem } from 'types/cart.interface';
import { getCart, updateCart } from '@services/cartService';

// Arrow Icon
function ArrowIcon({ open }: { open: boolean }) {
  return (
    <ChevronDownIcon
      className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`}
    />
  );
}

// Description Accordion Underneath Product Carousel
function DescriptionAccordion({ product }: { product: IProduct }) {
  const [open, setOpen] = useState(false);
  const [alwaysOpen, setAlwaysOpen] = useState(true);

  return (
    <>
      <Accordion open={alwaysOpen} icon={<ArrowIcon open={alwaysOpen} />}>
        <AccordionHeader onClick={() => setAlwaysOpen((cur) => !cur)}>
          DESCRIPTION
        </AccordionHeader>
        <AccordionBody className="text-normal">
          {product.description}
        </AccordionBody>
      </Accordion>
      <Accordion open={open} icon={<ArrowIcon open={open} />}>
        <AccordionHeader onClick={() => setOpen((cur) => !cur)}>
          SHIPPING INFO
        </AccordionHeader>
        <AccordionBody className="space-y-3">
          <p>Free standard shipping on orders over $75 in the US.</p>
          <div>
            <p className="font-medium">Estimated Delivery Times:</p>
            <ul className="list-disc pl-6 mt-1">
              <li>Standard Shipping (3-5 business days)</li>
              <li>Express Shipping (1-2 business days)</li>
            </ul>
          </div>
          <p>
            Orders placed before 2 PM EST on business days will be processed the
            same day. Weekend orders will be processed on the next business day.
          </p>
        </AccordionBody>
      </Accordion>
    </>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [state, setState] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setState('error');
      return;
    }

    const fetchProduct = async () => {
      setState('loading');

      try {
        const fetchedProduct = await getProductDetails(id);
        setProduct(fetchedProduct);
        setState('success');
      } catch (err) {
        console.error('Error fetching product:', err);
        setState('error');
      }
    };
    void fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const cartItem: ICartItem = {
      product_id: product!.product_id,
      name: product!.name,
      quantity: quantity,
      inventory: product!.inventory,
      price: product!.price,
    };
    // Get current cart
    try {
      const cart = await getCart();
      // Check if item already exists in cart
      const existingItem = cart.find(
        (item) => item.product_id === cartItem.product_id,
      );
      if (existingItem) {
        // Check if new quantity is valid
        existingItem.quantity =
          existingItem.quantity + quantity <= existingItem.inventory
            ? existingItem.quantity + quantity
            : existingItem.inventory;
      } else {
        cart.push(cartItem);
      }
      // Update cart
      await updateCart(cart);
      // Dispatch cart updated event
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error('Error updating cart:', err);
      // Show bottom alert
      window.dispatchEvent(
        new CustomEvent('show-bottom-alert', {
          detail: {
            message: 'Please sign in to add items to cart.',
            timeout: 2000,
          },
        }),
      );
    }
  };

  const body = () => {
    if (state === 'loading')
      return <h1 className="text-xl font-semibold">Loading...</h1>;
    if (state === 'error' || !product)
      return (
        <h1 className="text-xl font-semibold">
          Error fetching product details
        </h1>
      );
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Top Left: Product Carousel */}
          <div className="lg:w-1/2">
            <ProductCarousel product={product} />
          </div>
          {/* Top Right: Product Details */}
          <div className="lg:w-1/2 flex flex-col space-y-4">
            <h1 className="text-3xl font-bold">{product.name.toUpperCase()}</h1>
            <div className="text-2xl font-semibold text-blue-600">
              ${Number(product.price).toFixed(2)}
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-lg font-medium text-green-600">
                IN STOCK: {product.inventory}
              </div>
            </div>
            <div className="h-4"></div>
            <AmountInputArea
              min={1}
              max={product.inventory}
              defaultValue={1}
              onChange={setQuantity}
            />
            <Button onClick={() => void handleAddToCart()}>ADD TO CART</Button>
          </div>
        </div>

        {/* Bottom: Description Accordion */}
        <DescriptionAccordion product={product} />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">{body()}</div>
    </div>
  );
}

export default ProductDetails;
