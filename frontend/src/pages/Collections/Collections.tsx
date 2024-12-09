import ProductCard from '@components/ProductCard';
import ProductSkeleton from '@components/ProductSkeleton';
import { getProducts, getTotalPages } from '@services/productService';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { IProduct } from 'types/product.interface';

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Button,
} from '@material-tailwind/react';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const [active, setActive] = useState(currentPage);
  const [searchParams, setSearchParams] = useSearchParams();

  // Update search params
  const updateSearchParams = (newParams: Record<string, string>) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      updatedParams.set(key, value);
    });
    setSearchParams(updatedParams);
  };

  // Next page
  const next = () => {
    if (active === totalPages) return;
    setActive(active + 1);
    updateSearchParams({ page: (active + 1).toString() });
  };
  // Previous page
  const prev = () => {
    if (active === 1) return;
    setActive(active - 1);
    updateSearchParams({ page: (active - 1).toString() });
  };
  // Go to page
  const goToPage = (page: number) => {
    setActive(page);
    updateSearchParams({ page: page.toString() });
  };

  return (
    <div className="flex items-center gap-1">
      {/* Previous page */}
      <IconButton
        size="sm"
        variant="text"
        onClick={prev}
        disabled={active === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, index) => (
        <Button
          size="sm"
          variant={active === index + 1 ? 'filled' : 'text'}
          key={index}
          className="flex items-center"
          onClick={() => {
            goToPage(index + 1);
          }}
        >
          {index + 1}
        </Button>
      ))}
      {/* Next page */}
      <IconButton
        size="sm"
        variant="text"
        onClick={next}
        disabled={active === totalPages}
      >
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
    </div>
  );
}

function ResetSearchParamsButton() {
  const [, setSearchParams] = useSearchParams();
  return (
    <Button
      className="rounded-l-none bg-black text-white hover:bg-gray-900 w-1/3 sm:w-auto"
      onClick={() => setSearchParams({})}
    >
      RESET
    </Button>
  );
}

function OrderByDropdown() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (newParams: Record<string, string>) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      updatedParams.set(key, value);
    });
    // Reset page to 1
    updatedParams.set('page', '1');
    setSearchParams(updatedParams);
  };

  return (
    <Menu>
      <MenuHandler>
        <Button
          variant="outlined"
          className="rounded-none border-l-0 border-r-0 w-1/3 sm:w-auto"
          ripple={false}
        >
          SORT
        </Button>
      </MenuHandler>
      <MenuList>
        <MenuItem
          onClick={() => {
            updateSearchParams({ sort_by: 'created_at', order: 'desc' });
          }}
        >
          Newest
        </MenuItem>
        <MenuItem
          onClick={() => {
            updateSearchParams({ sort_by: 'sales_count', order: 'desc' });
          }}
        >
          Best Sellers
        </MenuItem>
        <MenuItem
          onClick={() => {
            updateSearchParams({ sort_by: 'price', order: 'asc' });
          }}
        >
          Price: Low to High
        </MenuItem>
        <MenuItem
          onClick={() => {
            updateSearchParams({ sort_by: 'price', order: 'desc' });
          }}
        >
          Price: High to Low
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function PriceFilterDropdown() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (newParams: Record<string, string>) => {
    const updatedParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      updatedParams.set(key, value);
    });
    // Reset page to 1
    updatedParams.set('page', '1');
    setSearchParams(updatedParams);
  };

  return (
    <Menu>
      <MenuHandler>
        <Button
          variant="outlined"
          className="rounded-r-none w-1/3 sm:w-auto"
          ripple={false}
        >
          PRICE
        </Button>
      </MenuHandler>
      <MenuList>
        <MenuItem
          onClick={() =>
            updateSearchParams({ price_min: '0', price_max: '100' })
          }
        >
          $0 - $100
        </MenuItem>
        <MenuItem
          onClick={() =>
            updateSearchParams({ price_min: '100', price_max: '200' })
          }
        >
          $100 - $200
        </MenuItem>
        <MenuItem
          onClick={() =>
            updateSearchParams({ price_min: '200', price_max: '300' })
          }
        >
          $200 - $300
        </MenuItem>
        <MenuItem
          onClick={() =>
            updateSearchParams({ price_min: '300', price_max: '400' })
          }
        >
          $300 - $400
        </MenuItem>
        <MenuItem
          onClick={() =>
            updateSearchParams({ price_min: '400', price_max: '500' })
          }
        >
          $400 - $500
        </MenuItem>
        <MenuItem
          onClick={() =>
            updateSearchParams({ price_min: '500', price_max: null as any })
          }
        >
           $500+
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

function Collections() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [state, setState] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );

  // Fetch products when the component mounts or when the category changes
  useEffect(() => {
    // Redirect to all products if category is not valid
    if (category && !['bracelet', 'necklace', 'ring'].includes(category)) {
      window.location.href = '/collections';
      return;
    }
    const fetchProducts = async () => {
      setState('loading');

      try {
        // Set search params
        const type = category as 'bracelet' | 'necklace' | 'ring';
        const sortBy = searchParams.get('sort_by') as
          | 'created_at'
          | 'price'
          | 'sales_count';
        const order = searchParams.get('order') as 'asc' | 'desc';
        const priceMin = Number(searchParams.get('price_min')) || null;
        const priceMax = Number(searchParams.get('price_max')) || null;
        const page = Number(searchParams.get('page')) || 1;

        // Get total number of pages
        const totalPages = await getTotalPages(type, priceMin, priceMax);
        // Set total number of pages
        setTotalPages(totalPages);
        // Set current page
        setCurrentPage(page);

        // Fetch products
        const fetchedProducts = await getProducts(
          type,
          sortBy,
          order,
          priceMin,
          priceMax,
          page,
        );
        // Set product list
        setProductList(fetchedProducts);
        // Set state to success
        setState('success');
      } catch (err) {
        console.error('Error fetching products:', err);
        setState('error');
      }
    };

    void fetchProducts();
  }, [category, searchParams]);

  // Body of the component based on loading and error state
  const body = () => {
    if (state === 'loading') {
      return (
        <>
          <h1 className="text-xl font-semibold mb-4">Loading...</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <ProductSkeleton />
          </div>
        </>
      );
    }

    if (state === 'error')
      return (
        <h1 className="text-xl font-semibold mb-4">Error fetching products</h1>
      );
    return (
      <>
        {/* Header */}
        <div className="flex w-full flex-col sm:flex-row justify-between px-2 sm:px-8 mt-4 mb-4">
          {/* Product Count */}
          <h1 className="text-xl font-semibold items-center flex mb-4 sm:mb-0 sm:w-1/2 sm:px-8 py-2">
            {productList.length} products
          </h1>
          {/* Filters */}
          <div className="w-full sm:w-auto flex justify-start sm:justify-end py-2">
            <div className="flex w-full sm:w-auto">
              <PriceFilterDropdown />
              <OrderByDropdown />
              <ResetSearchParamsButton />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {productList.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </>
    );
  };

  return (
    <div className="max-w-screen-3xl mx-auto px-8 sm:px-8 py-8 place-items-center">
      {body()}
    </div>
  );
}

export default Collections;
