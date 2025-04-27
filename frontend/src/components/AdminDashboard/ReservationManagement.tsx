// src/components/AdminDashboard/ReservationManagement.tsx

import React, { useState, useEffect } from 'react';
import { Calendar, Users, X, Check, RefreshCw, AlertTriangle, Search, Filter } from 'lucide-react';

// Define the Reservation type
interface Reservation {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  cottage_id: string;
  cottage_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  special_requests?: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  created_at: string;
}

// Define the API service for reservations
const reservationApi = {
  getAll: async (): Promise<Reservation[]> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await fetch('/api/v1/reservations/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  },
  
  cancelReservation: async (reservationId: number): Promise<any> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await fetch('/api/v1/reservations/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reservation_id: reservationId })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }
};

const ReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cottageFilter, setCottageFilter] = useState<string>('all');
  
  // Get unique cottage names for filtering
  const cottageOptions = Array.from(new Set(reservations.map(r => r.cottage_name))).sort();
  
  // Fetch reservations
  const fetchReservations = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await reservationApi.getAll();
      setReservations(data);
      applyFilters(data, searchTerm, statusFilter, cottageFilter);
    } catch (err: any) {
      setError(`Error loading reservations: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply filters to reservations
  const applyFilters = (
    data: Reservation[], 
    search: string, 
    status: string, 
    cottage: string
  ) => {
    let filtered = [...data];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        r => r.full_name.toLowerCase().includes(searchLower) || 
             r.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (status && status !== 'all') {
      filtered = filtered.filter(r => r.status === status);
    }
    
    // Apply cottage filter
    if (cottage && cottage !== 'all') {
      filtered = filtered.filter(r => r.cottage_name === cottage);
    }
    
    setFilteredReservations(filtered);
  };
  
  // Handle cancellation of a reservation
  const handleCancelReservation = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await reservationApi.cancelReservation(id);
      // Refresh the list
      await fetchReservations();
    } catch (err: any) {
      setError(`Error cancelling reservation: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect for initial load
  useEffect(() => {
    fetchReservations();
  }, []);
  
  // Effect for filtering
  useEffect(() => {
    applyFilters(reservations, searchTerm, statusFilter, cottageFilter);
  }, [searchTerm, statusFilter, cottageFilter, reservations]);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Reservation Management</h2>
        
        {/* Refresh Button */}
        <button 
          className="text-blue-500 hover:text-blue-700 flex items-center"
          onClick={fetchReservations}
          disabled={isLoading}
        >
          <span className="mr-1">Refresh</span>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      {/* Show loading/error states */}
      {isLoading && (
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded mb-4 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Loading reservations...
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          {/* Cottage Filter */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={cottageFilter}
              onChange={(e) => setCottageFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Cottages</option>
              {cottageOptions.map(cottage => (
                <option key={cottage} value={cottage}>{cottage}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Reservations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cottage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Check-in / Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    No reservations found
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{reservation.full_name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{reservation.email}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{reservation.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{reservation.cottage_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                          {new Date(reservation.check_in).toLocaleDateString()}
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-red-500" />
                          {new Date(reservation.check_out).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-900 dark:text-white">{reservation.guests}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : reservation.status === 'cancelled'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      )}
                      
                      {reservation.status === 'cancelled' && (
                        <span className="text-gray-400">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationManagement;