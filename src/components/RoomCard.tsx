import React from 'react';
interface RoomCardProps {
  title: string;
  image: string;
  price: number;
  description: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ title, image, price, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:-translate-y-1">
      <img 
        src={image} 
        alt={title}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-[#2A5A4B] mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-[#2A5A4B]">€{price}/night</span>
          <button className="px-6 py-2 bg-[#2A5A4B] text-white rounded-lg hover:bg-[#1d4235] transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;