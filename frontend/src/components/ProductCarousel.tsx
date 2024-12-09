import { Carousel } from '@material-tailwind/react';
import { IProduct } from 'types/product.interface';

function ProductCarousel({ product }: { product: IProduct }) {
  return (
    <Carousel
      loop={true}
      // Custom navigation for the carousel, see https://www.material-tailwind.com/docs/react/carousel
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="p-1 absolute bottom-4 left-2/4 flex -translate-x-2/4 gap-2 items-center bg-gray-500 bg-opacity-70 rounded-md">
          {new Array(length).fill('').map((_, i) => (
            <img
              key={i}
              src={product.images[i]}
              alt={product.name}
              className={`border rounded-md object-cover cursor-pointer ${
                activeIndex === i
                  ? 'border-blue-500 w-10 h-10'
                  : 'border-gray-500 w-9 h-9'
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {product.images.map((image) => (
        <img
          src={image}
          alt={product.name}
          key={image}
          className="w-full h-auto object-cover rounded-md"
        />
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
