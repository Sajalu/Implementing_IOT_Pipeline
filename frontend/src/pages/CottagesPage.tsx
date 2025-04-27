// File path: ./client/src/pages/CottagesPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Users, Wifi, Tv, Coffee, XCircle } from "lucide-react";

interface Cottage {
  id: number;
  name: string;
  description: string;
  price: string;
  capacity: string;
  rating: number;
  image: string;
  amenities: string[];
  isAvailable?: boolean; // Add availability property
}

const initialCottages: Cottage[] = [
  {
    id: 1,
    name: "The Pilot's Son 1",
    description: "Luxurious 3-bedroom villa with panoramic lake views and private sauna",
    price: "€250/night",
    capacity: "6 guests",
    rating: 4.9,
    image: "https://rakkaranta.fi/cdn/shop/files/DSC00541.jpg?v=1729705883&width=493",
    amenities: ["Private sauna", "Lake view", "Fully equipped kitchen", "Wi-Fi", "TV"],
  },
  {
    id: 2,
    name: "The Pilot's Son 2",
    description: "Cozy 2-bedroom cabin surrounded by pine forest",
    price: "€180/night",
    capacity: "4 guests",
    rating: 4.7,
    image: "https://rakkaranta.fi/cdn/shop/files/B_mokki_kansikuva.jpg?v=1737018020&width=493",
    amenities: ["Fireplace", "Forest view", "BBQ area", "Wi-Fi", "TV"],
  },
  {
    id: 3,
    name: "Henry Ford Cabin",
    description: "Modern 4-bedroom lodge with stunning sunset views",
    price: "€320/night",
    capacity: "8 guests",
    rating: 4.8,
    image: "https://rakkaranta.fi/cdn/shop/files/C_mokki_kansikuva.jpg?v=1737015692&width=493",
    amenities: ["Hot tub", "Terrace", "Game room", "Wi-Fi", "Smart TV"],
  },
  {
    id: 4,
    name: "Beach House",
    description: "Charming 1-bedroom cottage perfect for couples",
    price: "€150/night",
    capacity: "2 guests",
    rating: 4.6,
    image: "https://rakkaranta.fi/cdn/shop/files/D_mokki_kansikuva.jpg?v=1737018371&width=493",
    amenities: ["Private deck", "Kitchenette", "Breakfast included", "Wi-Fi", "TV"],
  },
  {
    id: 5,
    name: "Grand Lake House",
    description: "Spacious 5-bedroom house with private beach access",
    price: "€400/night",
    capacity: "10 guests",
    rating: 4.9,
    image: "https://rakkaranta.fi/cdn/shop/files/Yhteiset_tilat_kansikuva.jpg?v=1737018417&width=535",
    amenities: ["Private beach", "Boat dock", "Full kitchen", "Wi-Fi", "Entertainment system"],
  },
];

const CottagesPage: React.FC = () => {
  const [cottages, setCottages] = useState(initialCottages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch cottage availability when component mounts
  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        // Get date range for next 7 days as default
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const checkIn = today.toISOString().split('T')[0];
        const checkOut = nextWeek.toISOString().split('T')[0];
        
        // Fetch availability from the API
        const response = await fetch(`/api/v1/reservations/availability?check_in=${checkIn}&check_out=${checkOut}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch cottage availability');
        }
        
        const availabilityData = await response.json();
        
        // Map the availability data to our cottages
        setCottages(prev => prev.map(cottage => {
          // Find matching cottage in availability data by name
          const matchingCottage = availabilityData.find(
            (c: any) => c.name.toLowerCase() === cottage.name.toLowerCase()
          );
          
          return {
            ...cottage,
            isAvailable: matchingCottage ? matchingCottage.isAvailable : true
          };
        }));
      } catch (err: any) {
        console.error('Error fetching availability:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailability();
  }, []);

  const handleBookNow = (cottageName: string) => {
    navigate(`/book?cottage=${encodeURIComponent(cottageName)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Cottages</h1>
      
      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-2 text-gray-600">Checking availability...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cottages.map((cottage) => (
          <div
            key={cottage.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
          >
            <img
              src={cottage.image}
              alt={cottage.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold text-gray-900">{cottage.name}</h2>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{cottage.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{cottage.description}</p>
              <div className="flex items-center mb-4">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="ml-2 text-sm text-gray-600">{cottage.capacity}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {cottage.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {amenity === "Wi-Fi" && <Wifi className="h-3 w-3 mr-1" />}
                    {amenity === "TV" && <Tv className="h-3 w-3 mr-1" />}
                    {amenity === "Breakfast included" && <Coffee className="h-3 w-3 mr-1" />}
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">{cottage.price}</span>
                
                {cottage.isAvailable === false ? (
                  // Red "Unavailable" button for unavailable cottages
                  <button
                    disabled
                    className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center cursor-not-allowed"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Unavailable
                  </button>
                ) : (
                  // Normal "Book Now" button for available cottages
                  <button
                    onClick={() => handleBookNow(cottage.name)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CottagesPage;  