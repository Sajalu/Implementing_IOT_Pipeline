// File path: ./client/src/components/AdminDashboard/AdminDashboard.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Thermometer,
  DoorClosed,
  DoorOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Droplet,
  Calendar,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { sensorApi, SensorData } from "../../services/api";

// Define types for our UI data structures
interface RoomData {
  id: string | number;
  name: string;
  temperature: number;
  humidity: number;
  doorStatus: string;
  isBooked: boolean;
  lastUpdated?: string;
}

interface TimeSeriesData {
  time: string;
  value: number;
}

// Define props interface for charts
interface ChartProps {
  data: TimeSeriesData[];
  fullWidth?: boolean;
}

// Room name mapping based on device IDs
const roomNameMapping: Record<string, string> = {
  'device_pilots_son_1': "The Pilot's Son 1",
  'device_pilots_son_2': "The Pilot's Son 2",
  'device_henry_ford': "Henry Ford Cabin",
  'device_beach_house': "Beach House",
  'device_grand_lake': "Grand Lake House"
};

// Demo booking status (would come from a booking service in production)
const demoBookingStatus: Record<string, boolean> = {
  'device_pilots_son_1': true,
  'device_pilots_son_2': true,
  'device_henry_ford': false,
  'device_beach_house': true,
  'device_grand_lake': false
};

// Original mock data (as fallback)
const mockRooms: RoomData[] = [
  { id: 'device_pilots_son_1', name: "The Pilot's Son 1", temperature: 22.5, humidity: 45, doorStatus: "closed", isBooked: true },
  { id: 'device_pilots_son_2', name: "The Pilot's Son 2", temperature: 23.1, humidity: 42, doorStatus: "open", isBooked: true },
  { id: 'device_henry_ford', name: "Henry Ford Cabin", temperature: 21.8, humidity: 48, doorStatus: "closed", isBooked: false },
  { id: 'device_beach_house', name: "Beach House", temperature: 24.2, humidity: 50, doorStatus: "closed", isBooked: true },
  { id: 'device_grand_lake', name: "Grand Lake House", temperature: 20.5, humidity: 52, doorStatus: "open", isBooked: false },
];

// Simplified Temperature Chart
const TemperatureChart: React.FC<ChartProps> = ({
  data,
  fullWidth = false,
}) => {
  // Constants for temperature range
  const minTemp = 18;
  const maxTemp = 26;

  return (
    <div className={`w-full h-full flex flex-col ${fullWidth ? "px-4" : ""}`}>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <div>{maxTemp}°C</div>
      </div>

      <div className="relative flex-1 border-t border-b border-gray-200 dark:border-gray-700">
        {/* Chart */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Main line */}
          <polyline
            points={data
              .map((point, i) => {
                const x = (i / (data.length - 1)) * 100
                const y = 100 - ((point.value - minTemp) / (maxTemp - minTemp)) * 100
                return `${x},${y}`
              })
              .join(" ")}
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <div>{minTemp}°C</div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {data
          .filter((_, i) => i % Math.max(1, Math.floor(data.length / 5)) === 0)
          .map((point, i) => (
            <div key={i}>{point.time}</div>
          ))}
      </div>
    </div>
  )
};

// Humidity Chart with filled area matching the screenshot
const HumidityChart: React.FC<ChartProps> = ({
  data,
  fullWidth = false,
}) => {
  const minHumidity = 30;
  const maxHumidity = 70;
  const range = maxHumidity - minHumidity;

  // Generate SVG path for the chart line
  const generateLinePath = (): string => {
    const width = 100;
    const height = 100;

    // Map data points to SVG coordinates
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((point.value - minHumidity) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  // Generate SVG path for the filled area
  const generateAreaPath = (): string => {
    const width = 100;
    const height = 100;

    // Start at the bottom left
    let path = `M 0,${height} `;

    // Add all the points
    data.forEach((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((point.value - minHumidity) / range) * height;
      path += `L ${x},${y} `;
    });

    // Close the path to the bottom right and back to start
    path += `L ${width},${height} Z`;

    return path;
  };

  return (
    <div className={`w-full h-full flex flex-col ${fullWidth ? "px-4" : ""}`}>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <div>{maxHumidity}%</div>
      </div>

      <div className="relative flex-1 border-t border-b border-gray-200 dark:border-gray-700">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((_, i) => (
            <div key={i} className="w-full border-b border-gray-100 dark:border-gray-800"></div>
          ))}
        </div>

        {/* Chart */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Filled area */}
          <path d={generateAreaPath()} fill="rgba(244, 63, 94, 0.1)" stroke="none" />

          {/* Main line */}
          <path
            d={generateLinePath()}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, i) => {
            if (i % Math.max(1, Math.floor(data.length / 10)) !== 0) return null;
            const x = (i / (data.length - 1)) * 100
            const y = 100 - ((point.value - minHumidity) / range) * 100
            return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="3" fill="#f43f5e" stroke="#fff" strokeWidth="1" />
          })}
        </svg>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <div>{minHumidity}%</div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {data
          .filter((_, i) => i % Math.max(1, Math.floor(data.length / 5)) === 0)
          .map((point, i) => (
            <div key={i}>{point.time}</div>
          ))}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // State for dynamic data
  const [rooms, setRooms] = useState<RoomData[]>(mockRooms);
  const [temperatureData, setTemperatureData] = useState<TimeSeriesData[]>([]);
  const [humidityData, setHumidityData] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch data from the API
  const fetchData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await sensorApi.getData();

      if (!response || response.length === 0) {
        throw new Error('No data received from the API');
      }

      console.log('Fetched sensor data:', response);

      // Process the response as usual
      const roomData: RoomData[] = response.map((item: SensorData) => {
        const deviceId = String(item.device_id || item.id);
        const timestamp = new Date(item.timestamp);

        return {
          id: deviceId,
          name: roomNameMapping[deviceId] || `Room ${deviceId}`,
          temperature: item.temperature || 22.0,
          humidity: item.humidity || 45,
          doorStatus: item.door_status ? "open" : "closed",
          isBooked: demoBookingStatus[deviceId] || false,
          lastUpdated: timestamp.toLocaleString(),
        };
      });

      setRooms(roomData);

      // Handle history data for charts
      if (response[0]?.history?.length > 0) {
        const tempHistory: TimeSeriesData[] = response[0].history?.map((reading: any) => ({
          time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: reading.temperature,
        }));

        const humidHistory: TimeSeriesData[] = response[0].history.map((reading: any) => ({
          time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: reading.humidity,
        }));

        setTemperatureData(tempHistory);
        setHumidityData(humidHistory);
      }

      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching sensor data:', err);
      setError(`Error loading data: ${err.message}. Using demo data instead.`);
      setRooms(mockRooms); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data load and polling setup
  useEffect(() => {
    // Immediately fetch data when component mounts
    fetchData();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to home page
    navigate('/', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-gray-800 h-screen transition-all duration-300 shadow-lg fixed z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className={`flex items-center ${!isSidebarOpen && "justify-center w-full"}`}>
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              R
            </div>
            {isSidebarOpen && <span className="ml-2 text-xl font-bold dark:text-white">Rakkaranta</span>}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <nav className="mt-6 flex flex-col h-[calc(100%-4rem)]">
          <SidebarItem
            icon={<Home />}
            text="Dashboard"
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={<Thermometer />}
            text="Temperature"
            isActive={activeTab === "temperature"}
            onClick={() => setActiveTab("temperature")}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={<Droplet />}
            text="Humidity"
            isActive={activeTab === "humidity"}
            onClick={() => setActiveTab("humidity")}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={<DoorClosed />}
            text="Door Status"
            isActive={activeTab === "doors"}
            onClick={() => setActiveTab("doors")}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={<Calendar />}
            text="Bookings"
            isActive={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
            isSidebarOpen={isSidebarOpen}
          />
          <SidebarItem
            icon={<Settings />}
            text="Settings"
            isActive={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            isSidebarOpen={isSidebarOpen}
          />
          <div className="mt-auto mb-8">
            <SidebarItem
              icon={<LogOut />}
              text="Logout"
              isActive={false}
              onClick={handleLogout}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="mr-4 text-gray-500 dark:text-gray-400 md:hidden">
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {activeTab === "dashboard" ? "IoT Dashboard" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="py-2 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                  A
                </div>
                <span className="ml-2 text-gray-800 dark:text-white hidden md:inline">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Show loading/error states */}
          {isLoading && (
            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded mb-4 flex items-center">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading sensor data...
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          {lastUpdated && (
            <div className="text-sm text-gray-500 mb-4">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}

          {activeTab === "dashboard" && (
            <>
              {/* Room Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Room Status</h2>
                  {/* Refresh Button */}
                  <button 
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                    onClick={fetchData}
                    disabled={isLoading}
                  >
                    <span className="mr-1">Refresh</span>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Room
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Temperature
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Humidity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Door Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Booking Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {rooms.map((room) => (
                        <RoomStatusRow
                          key={room.id}
                          name={room.name}
                          temperature={room.temperature}
                          humidity={room.humidity}
                          doorStatus={room.doorStatus}
                          isBooked={room.isBooked}
                          lastUpdated={room.lastUpdated}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Temperature and Humidity Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Temperature Trend</h2>
                  {temperatureData.length > 0 ? (
                    <div className="h-64">
                      <TemperatureChart data={temperatureData} />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No temperature history data available
                    </div>
                  )}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Humidity Trend</h2>
                  {humidityData.length > 0 ? (
                    <div className="h-64">
                      <HumidityChart data={humidityData} />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      No humidity history data available
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "temperature" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Temperature Trends</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Temperature readings over time in degrees Celsius
              </p>

              {temperatureData.length > 0 ? (
                <div className="h-80">
                  <TemperatureChart data={temperatureData} fullWidth />
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No temperature history data available
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{room.name}</h3>
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">{room.temperature}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "humidity" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Humidity Trends</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Humidity readings over time in percentage</p>

              {humidityData.length > 0 ? (
                <div className="h-80 mb-6">
                  <HumidityChart data={humidityData} fullWidth />
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500 mb-6">
                  No humidity history data available
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{room.name}</h3>
                    <div className="flex items-center">
                      <Droplet className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">{room.humidity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "doors" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Door Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{room.name}</h3>
                    <div className="flex items-center justify-center">
                      {room.doorStatus === "open" ? (
                        <div className="flex flex-col items-center">
                          <DoorOpen className="h-16 w-16 text-yellow-500 mb-2" />
                          <span className="text-lg font-medium text-yellow-500">Door Open</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <DoorClosed className="h-16 w-16 text-green-500 mb-2" />
                          <span className="text-lg font-medium text-green-500">Door Closed</span>
                        </div>
                      )}
                    </div>
                    {room.lastUpdated && (
                      <div className="text-xs text-gray-500 mt-4 text-center">
                        Last updated: {room.lastUpdated}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Room Bookings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`rounded-lg p-6 ${room.isBooked ? "bg-green-50 dark:bg-green-900" : "bg-gray-50 dark:bg-gray-700"}`}
                  >
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">{room.name}</h3>
                    <div className="flex items-center justify-center">
                      {room.isBooked ? (
                        <div className="flex flex-col items-center">
                          <Calendar className="h-16 w-16 text-green-500 mb-2" />
                          <span className="text-lg font-medium text-green-500">Booked</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Calendar className="h-16 w-16 text-gray-400 mb-2" />
                          <span className="text-lg font-medium text-gray-400">Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Configure your IoT monitoring settings here.</p>
              
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Data Refresh Interval</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">How often to fetch new sensor data</p>
                  </div>
                  <select className="bg-gray-100 dark:bg-gray-700 border-0 rounded p-2">
                    <option>30 seconds</option>
                    <option>1 minute</option>
                    <option>5 minutes</option>
                    <option>15 minutes</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b dark:border-gray-700">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Notification Settings</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Configure alerts for sensor readings</p>
                  </div>
                  <button className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded">
                    Configure
                  </button>
                </div>
                
                <div className="flex justify-between items-center pb-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark/light theme</p>
                  </div>
                  <button className="bg-gray-200 dark:bg-gray-600 w-12 h-6 rounded-full relative">
                    <span className="absolute top-1 left-1 bg-white dark:bg-gray-800 w-4 h-4 rounded-full transition-all duration-300 transform dark:translate-x-6"></span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
  isSidebarOpen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isActive, onClick, isSidebarOpen }) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center p-4 cursor-pointer transition-colors
        ${
          isActive
            ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
        ${!isSidebarOpen && "justify-center"}
      `}
    >
      <div className={`${isActive ? "text-blue-600 dark:text-blue-300" : ""}`}>{icon}</div>
      {isSidebarOpen && <span className="ml-3">{text}</span>}
    </div>
  );
};

interface RoomStatusRowProps {
  name: string;
  temperature: number;
  humidity: number;
  doorStatus: string;
  isBooked: boolean;
  lastUpdated?: string;
}

const RoomStatusRow: React.FC<RoomStatusRowProps> = ({ name, temperature, humidity, doorStatus, isBooked, lastUpdated }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{name}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Thermometer className="h-4 w-4 text-red-500 mr-1" />
          <span className="text-sm text-gray-800 dark:text-gray-200">{temperature}°C</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Droplet className="h-4 w-4 text-blue-500 mr-1" />
          <span className="text-sm text-gray-800 dark:text-gray-200">{humidity}%</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            doorStatus === "open"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          }`}
        >
          {doorStatus === "open" ? (
            <div className="flex items-center">
              <DoorOpen className="h-3 w-3 mr-1" />
              <span>Open</span>
            </div>
          ) : (
            <div className="flex items-center">
              <DoorClosed className="h-3 w-3 mr-1" />
              <span>Closed</span>
            </div>
          )}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            isBooked
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {isBooked ? "Booked" : "Available"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
        {lastUpdated || "Not available"}
      </td>
    </tr>
  );
};

export default AdminDashboard;