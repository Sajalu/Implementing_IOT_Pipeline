import React from 'react';
import { Sun, Snowflake, BatteryCharging, Umbrella, Waves, Ship, Dumbbell, SkipBack as Ski, Thermometer } from 'lucide-react';

const ActivitiesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Seasonal Activities</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Summer Activities */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-8 shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center mb-6">
            <Sun className="h-8 w-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Summer</h2>
          </div>
          <ul className="space-y-4">
            <ActivityItem 
              icon={<BatteryCharging className="h-5 w-5 text-green-600" />}
              text="2 electric car charging points, where guests can charge free of charge"
            />
            <ActivityItem 
              icon={<Umbrella className="h-5 w-5 text-yellow-600" />}
              text="Private sandy beach"
            />
            <ActivityItem 
              icon={<Waves className="h-5 w-5 text-blue-600" />}
              text="Beach sauna"
            />
            <ActivityItem 
              icon={<Ship className="h-5 w-5 text-blue-600" />}
              text="Rowing boat"
            />
            <ActivityItem 
              icon={<Waves className="h-5 w-5 text-cyan-600" />}
              text="Sup-board"
            />
            <ActivityItem 
              icon={<Ship className="h-5 w-5 text-blue-500" />}
              text="Kayaks"
            />
            <ActivityItem 
              icon={<Waves className="h-5 w-5 text-blue-400" />}
              text="Water running belts"
            />
            <ActivityItem 
              icon={<Dumbbell className="h-5 w-5 text-gray-600" />}
              text="Gym"
            />
          </ul>
        </div>

        {/* Winter Activities */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center mb-6">
            <Snowflake className="h-8 w-8 text-blue-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Winter</h2>
          </div>
          <ul className="space-y-4">
            <ActivityItem 
              icon={<Ski className="h-5 w-5 text-blue-600" />}
              text="2 ski tickets included in the accommodation of each cottage"
            />
            <ActivityItem 
              icon={<BatteryCharging className="h-5 w-5 text-green-600" />}
              text="2 electric car charging points, where guests can charge free of charge"
            />
            <ActivityItem 
              icon={<Thermometer className="h-5 w-5 text-blue-600" />}
              text="Avanto"
            />
            <ActivityItem 
              icon={<Waves className="h-5 w-5 text-blue-600" />}
              text="Beach sauna"
            />
            <ActivityItem 
              icon={<Waves className="h-5 w-5 text-orange-600" />}
              text="Kotalaavu"
            />
            <ActivityItem 
              icon={<Dumbbell className="h-5 w-5 text-gray-600" />}
              text="Gym"
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  text: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, text }) => {
  return (
    <li className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg shadow-sm">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-gray-700">{text}</span>
    </li>
  );
};

export default ActivitiesPage;