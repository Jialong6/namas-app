import { useEffect, useState } from 'react';
import ProductCard from '@components/ProductCard';
import ProductSkeleton from '@components/ProductSkeleton';
import { getProducts } from '@services/productService';
import { IProduct } from 'types/product.interface';

function BestSellers() {
  const [bestSellerList, setBestSellerList] = useState<IProduct[]>([]);
  const [state, setState] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      setState('loading');

      try {
        const fetchedProducts: IProduct[] = await getProducts(
          null,
          'sales_count',
          'desc',
        );
        setBestSellerList(fetchedProducts.slice(0, 5)); // Only show 5 products
      } catch (err) {
        console.error('Error fetching products:', err);
        setState('error');
      } finally {
        setState('success');
      }
    };

    void fetchProducts();
  }, []);

  if (state === 'loading')
    return (
      <>
        <h1 className="text-xl font-semibold mb-4">Loading...</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          <ProductSkeleton />
        </div>
      </>
    );
  if (state === 'error')
    return (
      <h1 className="text-xl font-semibold mb-4">Error fetching products</h1>
    );
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Best Sellers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {bestSellerList.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </>
  );
}

export default BestSellers;
