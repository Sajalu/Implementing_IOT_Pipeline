import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-screen">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070&h=1200"
          alt="Luxury Cottage"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
          <p className="text-lg mb-4 tracking-wider">JUST ENJOY AND RELAX</p>
          <h1 className="text-5xl md:text-7xl font-light mb-8 max-w-4xl">
            YOUR LUXURY COTTAGE FOR VACATION
          </h1>
          <Link
            to="/cottages"
            className="bg-[#B68D40] text-white px-8 py-3 rounded hover:bg-[#A67C30] transition-colors"
          >
            SEE OUR COTTAGES
          </Link>
        </div>
      </div>

      {/* Booking Widget */}
      <div className="relative -mt-24 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input type="date" className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded" />
          <input type="date" className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded" />
          <select className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded">
            <option>1 Adult</option>
            <option>2 Adults</option>
            <option>3 Adults</option>
            <option>4 Adults</option>
          </select>
          <select className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded">
            <option>No Kids</option>
            <option>1 Kid</option>
            <option>2 Kids</option>
            <option>3 Kids</option>
          </select>
          <button className="bg-[#B68D40] text-white py-3 px-6 rounded hover:bg-[#A67C30] transition-colors">
            CHECK NOW
          </button>
        </div>
      </div>

      {/* Cottages Section */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Cottages</h2>
          <div className="w-24 h-1 bg-[#B68D40] mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cottages.map((cottage) => (
            <Link to="/cottages" key={cottage.id}>
              <div className="relative group rounded-lg overflow-hidden shadow-lg cursor-pointer">
                <img
                  src={cottage.image}
                  alt={cottage.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-lg font-semibold">{cottage.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

// Cottage data
const cottages = [
  {
    id: 1,
    name: "The Pilot's Son 1",
    image: "https://rakkaranta.fi/cdn/shop/files/DSC00541.jpg?v=1729705883&width=493"
  },
  {
    id: 2,
    name: "The Pilot's Son 2",
    image: "https://rakkaranta.fi/cdn/shop/files/B_mokki_kansikuva.jpg?v=1737018020&width=493"
  },
  {
    id: 3,
    name: "Henry Ford Cabin",
    image: "https://rakkaranta.fi/cdn/shop/files/C_mokki_kansikuva.jpg?v=1737015692&width=493"
  },
  {
    id: 4,
    name: "Beach House",
    image: "https://rakkaranta.fi/cdn/shop/files/D_mokki_kansikuva.jpg?v=1737018371&width=493"
  },
  {
    id: 5,
    name: "Common facilities and additional services",
    image: "https://rakkaranta.fi/cdn/shop/files/Yhteiset_tilat_kansikuva.jpg?v=1737018417&width=535"
  }
];

export default HomePage;
