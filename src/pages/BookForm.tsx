// src/pages/BookForm.tsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Check, AlertTriangle, RefreshCw } from "lucide-react";

// Define cottage type
interface Cottage {
  id: string;
  name: string;
  isAvailable?: boolean;
}

// Initial cottages data
const initialCottages: Cottage[] = [
  { id: "device_pilots_son_1", name: "The Pilot's Son 1" },
  { id: "device_pilots_son_2", name: "The Pilot's Son 2" },
  { id: "device_henry_ford", name: "Henry Ford Cabin" },
  { id: "device_beach_house", name: "Beach House" },
  { id: "device_grand_lake", name: "Grand Lake House" },
];

// API service for bookings and availability
const bookingApi = {
  // Check availability for all cottages
  checkAvailability: async (checkIn: string, checkOut: string): Promise<Cottage[]> => {
    try {
      // In a real app, uncomment to use API
      // const response = await fetch(`/api/v1/reservations/availability?check_in=${checkIn}&check_out=${checkOut}`);
      // if (!response.ok) throw new Error('Failed to fetch availability');
      // return await response.json();
      
      // For demo purposes, return mock data with random availability
      return initialCottages.map(cottage => ({
        ...cottage,
        isAvailable: Math.random() > 0.3 // 70% chance of being available
      }));
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  },
  
  // Submit booking
  submitBooking: async (bookingData: any): Promise<any> => {
    try {
      // In a real app, uncomment to use API
      // const response = await fetch('/api/v1/reservations/book', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(bookingData)
      // });
      // if (!response.ok) throw new Error('Failed to create booking');
      // return await response.json();
      
      // For demo purposes, simulate API response
      return {
        success: true,
        message: 'Booking confirmed successfully',
        reservation: { ...bookingData, id: Math.floor(Math.random() * 1000) }
      };
    } catch (error) {
      console.error('Error submitting booking:', error);
      throw error;
    }
  }
};

const BookForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedCottage = queryParams.get("cottage");

  // State hooks
  const [cottages, setCottages] = useState<Cottage[]>(initialCottages);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    cottage_id: selectedCottage || "",
    specialRequests: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear availability check when dates or cottage changes
    if (name === 'checkIn' || name === 'checkOut' || name === 'cottage_id') {
      setAvailabilityChecked(false);
      setError('');
      setSuccess('');
    }
  };

  // Check availability
  const checkAvailability = async () => {
    // Validate dates
    if (!formData.checkIn || !formData.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }
    
    // Validate cottage selection
    if (!formData.cottage_id) {
      setError('Please select a cottage');
      return;
    }
    
    setIsCheckingAvailability(true);
    setError('');
    setSuccess('');
    
    try {
      const availableCottages = await bookingApi.checkAvailability(
        formData.checkIn,
        formData.checkOut
      );
      
      setCottages(availableCottages);
      
      // Check if selected cottage is available
      const selectedCottageData = availableCottages.find(c => c.id === formData.cottage_id);
      if (selectedCottageData?.isAvailable) {
        setSuccess('The selected cottage is available for your dates!');
      } else {
        setError('The selected cottage is not available for these dates. Please choose another cottage or dates.');
      }
      
      setAvailabilityChecked(true);
    } catch (err: any) {
      setError(`Error checking availability: ${err.message}`);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Submit booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If availability hasn't been checked, do it first
    if (!availabilityChecked) {
      await checkAvailability();
      // Don't proceed with booking until availability is confirmed
      return;
    }
    
    // Check if selected cottage is available
    const selectedCottageData = cottages.find(c => c.id === formData.cottage_id);
    if (!selectedCottageData?.isAvailable) {
      setError('This cottage is not available for the selected dates');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Get cottage name for the booking
      const cottageName = selectedCottageData.name;
      
      // Prepare booking data
      const bookingData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cottage_id: formData.cottage_id,
        cottage_name: cottageName,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        guests: parseInt(formData.guests),
        special_requests: formData.specialRequests
      };
      
      // Submit booking
      const response = await bookingApi.submitBooking(bookingData);
      
      setSuccess('Booking confirmed! You will receive a confirmation email shortly.');
      
      // Reset form or redirect
      setTimeout(() => {
        navigate('/'); // Redirect to home page after 3 seconds
      }, 3000);
      
    } catch (err: any) {
      setError(`Error submitting booking: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Blue Box for Heading */}
      <div className="bg-blue-600 text-white py-4 px-6 rounded-md text-center mb-6">
        <h2 className="text-2xl font-semibold">Book Your Stay</h2>
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="bg-green-50 text-green-800 border border-green-200 px-4 py-3 rounded mb-4 flex items-center">
          <Check className="h-5 w-5 mr-2 text-green-500" />
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 px-4 py-3 rounded mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Cottage Selection */}
        <div className="mb-4">
          <label htmlFor="cottage_id" className="block text-gray-700 mb-1 font-medium">
            Select Cottage:
          </label>
          <select
            id="cottage_id"
            name="cottage_id"
            value={formData.cottage_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            disabled={isSubmitting}
          >
            <option value="" disabled>
              Select a cottage
            </option>
            {cottages.map((cottage) => (
              <option 
                key={cottage.id} 
                value={cottage.id}
                disabled={availabilityChecked && cottage.isAvailable === false}
              >
                {cottage.name} {availabilityChecked && cottage.isAvailable !== undefined && (
                  cottage.isAvailable ? " (Available)" : " (Not Available)"
                )}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="checkIn" className="block text-gray-700 mb-1 font-medium">
              Check-in Date:
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 pl-10 border rounded"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="checkOut" className="block text-gray-700 mb-1 font-medium">
              Check-out Date:
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                required
                min={formData.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full p-2 pl-10 border rounded"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Check Availability Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={checkAvailability}
            disabled={isCheckingAvailability || isSubmitting || !formData.checkIn || !formData.checkOut || !formData.cottage_id}
            className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded font-medium flex justify-center items-center"
          >
            {isCheckingAvailability ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking Availability...
              </>
            ) : (
              'Check Availability'
            )}
          </button>
        </div>

        {/* Contact Information - Only show if a cottage is available */}
        {(!availabilityChecked || cottages.find(c => c.id === formData.cottage_id)?.isAvailable) && (
          <>
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Information</h3>
              
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-gray-700 mb-1 font-medium">
                  Full Name:
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1 font-medium">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-1 font-medium">
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="guests" className="block text-gray-700 mb-1 font-medium">
                  Number of Guests:
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={isSubmitting}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="specialRequests" className="block text-gray-700 mb-1 font-medium">
                  Special Requests:
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  placeholder="Any special requests?"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border rounded"
                  disabled={isSubmitting}
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !availabilityChecked || !cottages.find(c => c.id === formData.cottage_id)?.isAvailable}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-semibold flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default BookForm;
