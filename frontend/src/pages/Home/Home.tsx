import { Carousel } from '@material-tailwind/react';
import BestSellers from './BestSellers';
import NewArrivals from './NewArrivals';

interface ISlide {
  id: number;
  image: string;
}

// The sliding window display posters on the home page
function HomeCarousel({ slides }: { slides: ISlide[] }) {
  // Custom navigation for the carousel, see https://www.material-tailwind.com/docs/react/carousel
  const customNavigation = ({
    setActiveIndex,
    activeIndex,
    length,
  }: {
    setActiveIndex: (index: number) => void;
    activeIndex: number;
    length: number;
  }) => (
    <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
      {new Array(length).fill('').map((_, i) => (
        <span
          key={i}
          className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
            activeIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/50'
          }`}
          onClick={() => setActiveIndex(i)}
        />
      ))}
    </div>
  );

  return (
    <Carousel
      autoplay={true}
      autoplayDelay={3000}
      loop={true}
      navigation={customNavigation}
    >
      {slides.map((slide) => (
        <img
          src={slide.image}
          alt={`Slide ${slide.id}`}
          key={slide.id}
          className="w-full h-96 object-cover"
        />
      ))}
    </Carousel>
  );
}

function Home() {
  const slides = [
    { id: 1, image: '/poster1.webp' },
    { id: 2, image: '/poster2.webp' },
    { id: 3, image: '/poster3.webp' },
  ];

  return (
    <>
      <div className="mx-auto max-w-full relative shadow-lg overflow-hidden">
        <HomeCarousel slides={slides} />
      </div>
      <div className="max-w-screen-3xl mx-auto px-4 py-8 place-items-center">
        <BestSellers />
      </div>
      <div className="max-w-screen-3xl mx-auto px-4 py-8 place-items-center">
        <NewArrivals />
      </div>
    </>
  );
}

export default Home;
