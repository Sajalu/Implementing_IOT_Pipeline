"use client";

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const cottages = [
  { id: 1, name: "The Pilot's Son 1" },
  { id: 2, name: "The Pilot's Son 2" },
  { id: 3, name: "Henry Ford Cabin" },
  { id: 4, name: "Beach House" },
  { id: 5, name: "Grand Lake House" },
];

const BookForm: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCottage = queryParams.get("cottage");

  console.log("Selected Cottage:", selectedCottage); // Debugging

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    cottage: selectedCottage || "",
    specialRequests: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Booking request submitted successfully!");
  };

  return (
    <div>
      {/* Blue Box for Heading */}
      <div className="bg-blue-600 text-white py-4 px-6 rounded-md text-center mb-6">
        <h2 className="text-2xl font-semibold">Book Your Stay</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="cottage" className="block text-gray-700 mb-1">
            Select Cottage:
          </label>
          <select
            id="cottage"
            name="cottage"
            value={formData.cottage}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Select a cottage
            </option>
            {cottages.map((cottage) => (
              <option key={cottage.id} value={cottage.name}>
                {cottage.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 mb-1">
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
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">
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
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 mb-1">
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
          />
        </div>

        <div className="mb-4">
          <label htmlFor="checkIn" className="block text-gray-700 mb-1">
            Check-in Date:
          </label>
          <input
            type="date"
            id="checkIn"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="checkOut" className="block text-gray-700 mb-1">
            Check-out Date:
          </label>
          <input
            type="date"
            id="checkOut"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="guests" className="block text-gray-700 mb-1">
            Number of Guests:
          </label>
          <select
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="1">1 Guest</option>
            <option value="2">2 Guests</option>
            <option value="3">3 Guests</option>
            <option value="4">4 Guests</option>
            <option value="5">5 Guests</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="specialRequests" className="block text-gray-700 mb-1">
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
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-semibold"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookForm;
