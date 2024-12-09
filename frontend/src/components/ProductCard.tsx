import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Carousel,
} from '@material-tailwind/react';
import { NavLink } from 'react-router-dom';
import { IProduct } from 'types/product.interface';

export default function ProductCard({ product }: { product: IProduct }) {
  return (
    <Card className="max-w-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 rounded-none h-64"
      >
        <Carousel className="h-full">
          {product.images.map((image) => (
            <img
              src={image}
              alt={product.name}
              key={image}
              className="h-full w-full object-cover"
            />
          ))}
        </Carousel>
      </CardHeader>
      <CardBody className="p-3 flex justify-between">
        <NavLink to={`/details/${product.product_id}`}>
          <Typography variant="h4" color="blue-gray">
            {product.name.toUpperCase()}
          </Typography>
        </NavLink>
        {/* Rating */}
        <Typography
          color="blue-gray"
          className="flex items-center gap-1.5 font-normal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="-mt-0.5 h-5 w-5 text-yellow-700"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
          {product.rating ?? 'N/A'}
        </Typography>
      </CardBody>
      <CardFooter className="flex items-center justify-between p-3">
        <Typography className="font-normal">${product.price}</Typography>
      </CardFooter>
    </Card>
  );
}
