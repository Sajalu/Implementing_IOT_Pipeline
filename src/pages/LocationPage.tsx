import type React from "react"
import { Plane, Train, Bus, Car, MapPin } from "lucide-react"

const LocationPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">How to Reach Ukkohalla</h1>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 shadow-lg mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Map Image */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200&h=800"
              alt="Finland Map"
              className="w-full h-full object-cover"
            />
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
            For detailed directions and travel planning, you can visit the official{" "}
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
  )
}

interface DistanceItemProps {
  city: string
  distance: string
}

const DistanceItem: React.FC<DistanceItemProps> = ({ city, distance }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
      <span className="font-medium text-gray-900">{city}</span>
      <span className="text-gray-600">{distance}</span>
    </div>
  )
}

export default LocationPage

