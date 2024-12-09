import { IBead } from 'types/customize.interface';
import { useState, useEffect } from 'react';
import { Tooltip } from '@material-tailwind/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const BeadSelector = ({
  beads,
  onBeadSelect,
}: {
  beads: IBead[];
  onBeadSelect: (bead: IBead) => void;
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.querySelector('.beads-container');
    if (container) {
      const distance = container.clientWidth;
      const scrollAmount = direction === 'left' ? -distance : distance;
      container.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-xxl">
        {/* Beads container */}
        {beads && beads.length > 0 ? (
          <>
            {/* Scroll left button */}
            <button
              onClick={() => handleScroll('left')}
              className="w-8 absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white/40 hover:bg-white/60 p-1 rounded-lg shadow-md"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            {/* Display available beads */}
            <div className="beads-container flex mx-auto gap-2 justify-start mt-2 bg-gray-100 p-4 rounded-lg shadow-lg w-90vw max-w-xxl overflow-x-auto scroll-smooth">
              {beads.map((bead, index) => (
                <Tooltip key={index} content={bead.name}>
                  <img
                    key={index}
                    src={bead.imgPath}
                    alt={bead.name || `Bead ${index}`}
                    className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-full border-2 border-gray-300 cursor-pointer hover:border-green-400 hover:shadow-md hover:shadow-green-400 flex-shrink-0`}
                    onClick={() => onBeadSelect(bead)}
                  />
                </Tooltip>
              ))}
            </div>
            {/* Scroll right button */}
            <button
              onClick={() => handleScroll('right')}
              className="w-8 absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white/40 hover:bg-white/60 p-1 rounded-lg shadow-md"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        ) : (
          // No bead available
          <div className="text-center p-4 text-gray-600">
            Sorry, no beads are available now.
          </div>
        )}
      </div>
    </div>
  );
};

export default BeadSelector;
