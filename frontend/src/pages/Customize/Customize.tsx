import { Button } from '@material-tailwind/react';
import { useState, useEffect } from 'react';
import { getProducts } from '@services/productService';
import { IBraceletSlot, IBead } from 'types/customize.interface';
import BraceletDisplay from './BraceletDisplay';
import BeadSelector from './BeadSelector';
import { getCart, updateCart } from '@services/cartService';
import { ICartItem } from 'types/cart.interface';

const Customize = () => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [braceletCompleted, setBraceletCompleted] = useState(false);
  const [selectSlotWarning, setSelectSlotWarning] = useState('');
  // Initialize the customized beads with null
  const [customizedBracelet, setCustomizedBracelet] = useState<IBraceletSlot[]>(
    Array(12).fill({ bead: null } as IBraceletSlot),
  );
  // Load available beads
  const [availableBeads, setAvailableBeads] = useState<IBead[]>([]);

  useEffect(() => {
    // Fetch all beads from the backend and set them to the available beads
    const fetchBeadProducts = async () => {
      try {
        const fetchedBeads = await getProducts('bead');
        setAvailableBeads(
          fetchedBeads.map((bead) => ({
            bead_id: bead.product_id,
            name: bead.name,
            imgPath: bead.images[0],
          })),
        );
      } catch (error) {
        console.error('Error fetching beads:', error);
        // Show bottom alert
        window.dispatchEvent(
          new CustomEvent('show-bottom-alert', {
            detail: {
              message: 'Error fetching beads. Please try again later.',
              timeout: 2000,
            },
          }),
        );
      }
    };
    void fetchBeadProducts();
  }, []);

  const handleSlotClick = (index: number) => {
    if (selectedSlot !== index) {
      setSelectedSlot(index);
      setSelectSlotWarning('');
    } else {
      setSelectedSlot(null);
    }
  };

  const handleBeadSelect = (bead: IBead) => {
    if (selectedSlot === null) {
      setSelectSlotWarning('Please select a slot first.');
      return;
    }

    // Update the selected slot with the chosen bead
    const updatedBracelet = [...customizedBracelet];
    updatedBracelet[selectedSlot] = { bead: bead };
    setCustomizedBracelet(updatedBracelet);
    // Move to the next slot
    setSelectedSlot((selectedSlot + 1) % 12);

    // Check if the bracelet is completed
    if (updatedBracelet.every((slot) => slot.bead !== null)) {
      setBraceletCompleted(true);
      setSelectedSlot(null);
    }
  };

  const handleRemoveBead = () => {
    if (selectedSlot === null) {
      setSelectSlotWarning('Please select a slot to remove the bead.');
      return;
    }

    const updatedBracelet = [...customizedBracelet];
    updatedBracelet[selectedSlot] = { bead: null };
    setCustomizedBracelet(updatedBracelet);

    setBraceletCompleted(updatedBracelet.every((slot) => slot.bead !== null));

    setSelectSlotWarning('');
  };


  const handleAddToCart = async () => {
    try {
      // Create a new item for the customized bracelet
      const newItem: ICartItem = {
        product_id: '',
        quantity: 1,
        category: 'customized_bracelet',
        name: 'Customized Bracelet',
        inventory: 1,
        price: 120,
        beads: customizedBracelet.map((slot) => slot.bead!),
      };
      const cart = await getCart();
      cart.push(newItem);
      await updateCart(cart);
      // Open the cart
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Error adding item to cart:', error);
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

  return (
    <div className="container mx-auto px-4 py-8 place-items-center">
      <h1 className="text-center text-3xl font-bold">
        CUSTOMIZE YOUR OWN BRACELET
      </h1>
      <h2 className="text-center text-lg font-normal mt-2 text-gray-500">
        {braceletCompleted
          ? 'Your custom bracelet is completed! Click "Add to Cart" to proceed.'
          : selectedSlot !== null
            ? `Choose a bead for the slot.`
            : 'Start by clicking on a slot, and then choose a bead below.'}
      </h2>
      <div className="flex justify-center mt-4 mb-8 rounded-xl shadow-lg bg-gray-100 p-4">
        <BraceletDisplay
          bracelet={customizedBracelet}
          selectedSlot={selectedSlot}
          onSlotClick={handleSlotClick}
        />
      </div>
      <div className="mt-4 items-center">
        <h3 className="text-center text-lg font-normal mt-2 text-red-500">
          {selectSlotWarning}
        </h3>
        <BeadSelector
          beads={availableBeads}
          onBeadSelect={handleBeadSelect}
        />
      </div>
      <div className="flex justify-center mt-8 space-x-8">
        <Button
          disabled={!braceletCompleted}
          onClick={() => void handleAddToCart()}
        >
          Add to Cart
        </Button>

        <Button
          disabled={selectedSlot === null || !customizedBracelet[selectedSlot]?.bead}
          onClick={() => handleRemoveBead()}
        >
          Remove Bead
        </Button>
      </div>
    </div>
  );
};

export default Customize;
