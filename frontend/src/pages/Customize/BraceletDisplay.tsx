import { IBraceletSlot } from 'types/customize.interface';

const BraceletDisplay = ({
  bracelet,
  selectedSlot,
  onSlotClick,
}: {
  bracelet: IBraceletSlot[];
  selectedSlot: number | null;
  onSlotClick: (index: number) => void;
}) => {
  // Calculate the base size based on the window width
  const isMobile = window.innerWidth < 768;
  const baseSize = isMobile ? window.innerWidth * 0.75 : 350;
  return (
    <div className="relative w-[min(350px,75vw)] h-[min(350px,75vw)] m-6 rounded-full border-2 border-gray-300">
      {bracelet.map((braceletSlot, index) => {
        const angle = (360 / bracelet.length) * index;
        const radius = isMobile ? baseSize / 2 : baseSize / 2;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);

        return (
          <div
            key={index}
            className={`absolute rounded-full ${isMobile ? 'w-12 h-12' : 'w-16 h-16'} border-2 ${
              selectedSlot === index
                ? 'border-green-300 shadow-lg shadow-green-300'
                : 'border-gray-400'
            } bg-white flex items-center justify-center cursor-pointer hover:border-green-300`}
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              left: '50%',
              top: '50%',
              transformOrigin: 'center',
            }}
            onClick={() => {
              onSlotClick(index);
            }}
          >
            {braceletSlot.bead && (
              <img
                src={braceletSlot.bead.imgPath}
                alt={braceletSlot.bead.name}
                className="rounded-full w-full h-full"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BraceletDisplay;
