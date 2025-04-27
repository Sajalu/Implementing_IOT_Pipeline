import React from 'react';
import { Plane, Train, Bus, Car, MapPin } from 'lucide-react';

const LocationPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">How to Reach Ukkohalla</h1>
      
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 shadow-lg mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Map */}
	  <div className="rounded-lg overflow-hidden shadow-md h-full">
	    <iframe
   		 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3121.4125466040928!2d28.252255088567!3d64.74951539719231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4429d9a556bdc2ed%3A0xd3af084a5a8d296e!2sUkkohallantie%208%2C%2089400%20Hyrynsalmi%2C%20Finland!5e0!3m2!1sen!2sus!4v1745235588307!5m2!1sen!2sus"
   		 width="100%"
   		 height="400"
   		 style={{ border: 0 }}
   		 allowFullScreen=""
   		 loading="lazy"
   		 referrerPolicy="no-referrer-when-downgrade"
   		 title="Rakkaranta Location Map"
    		 className="w-full h-full"
 	     ></iframe>
	  </div>
          
          {/* Travel Options */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 bg-white/70 p-4 rounded-lg shadow-sm">
              <Plane className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Nearest Airport</h3>
                <p className="text-gray-600">Kajaani Airport - 86 km</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/70 p-4 rounded-lg shadow-sm">
              <Train className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Nearest Railway Station</h3>
                <p className="text-gray-600">Kontiomäki Station - 66 km</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/70 p-4 rounded-lg shadow-sm">
              <Bus className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Bus Stop</h3>
                <p className="text-gray-600">Hyrynsalmi - 18 km</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Major Cities Distance */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/80 rounded-lg p-6 shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <Car className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Distance from Major Cities</h2>
          </div>
          <div className="space-y-4">
            <DistanceItem city="Oulu" distance="170 km" />
            <DistanceItem city="Helsinki" distance="635 km" />
          </div>
        </div>

        <div className="bg-white/80 rounded-lg p-6 shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">More Information</h2>
          </div>
          <p className="text-gray-600">
            For detailed directions and travel planning, you can visit the official{' '}
            <a 
              href="https://ukkohalla.fi/saapuminen/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Ukkohalla arrival information page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

interface DistanceItemProps {
  city: string;
  distance: string;
}

const DistanceItem: React.FC<DistanceItemProps> = ({ city, distance }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
      <span className="font-medium text-gray-900">{city}</span>
      <span className="text-gray-600">{distance}</span>
    </div>
  );
};

export default LocationPage;
