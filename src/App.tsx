import { Wifi, Car, Utensils, Wine, Droplet, Dumbbell } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RoomCard from './components/RoomCard';

function App() {
  const rooms = [
    {
      title: 'Deluxe Suite',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000',
      price: 299,
      description: 'Luxurious suite with ocean view, king-size bed, and private balcony.',
    },
    {
      title: 'Executive Room',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000',
      price: 199,
      description: 'Spacious room with city view, queen-size bed, and work area.',
    },
    {
      title: 'Family Suite',
      image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1000',
      price: 399,
      description: 'Perfect for families with two bedrooms and a living area.',
    },
  ];

  const amenities = [
    { icon: <Wifi className="w-6 h-6" />, name: 'Free Wi-Fi' },
    { icon: <Car className="w-6 h-6" />, name: 'Free Parking' },
    { icon: <Utensils className="w-6 h-6" />, name: 'Restaurant' },
    { icon: <Wine className="w-6 h-6" />, name: 'Bar' },
    { icon: <Droplet className="w-6 h-6" />, name: 'Swimming Pool' },
    { icon: <Dumbbell className="w-6 h-6" />, name: 'Fitness Center' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      {/* Rooms Section */}
      <section id="rooms" className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Our Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <RoomCard key={room.title} {...room} />
          ))}
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Hotel Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {amenities.map((amenity) => (
              <div key={amenity.name} className="flex flex-col items-center">
                {amenity.icon}
                <span className="mt-2 text-sm font-medium text-gray-700">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
