"use client"

import type React from "react"

import { useState } from "react"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    specialRequests: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", formData)
    alert("Booking request submitted successfully!")
  }

  // Function to open availability check in a new tab
  const openAvailabilityCheck = () => {
    window.open("/check-availability", "_blank")
  }

  return (

        <div className="mt-16">
          <h2 className="text-2xl flex items-center justify-center font-semibold mb-4 text-center">Book Your Stay</h2>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
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

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded font-semibold"
              >
                Book Now
              </button>

              <button
                type="button"
                className="w-full border border-blue-500 text-blue-500 hover:bg-blue-50 py-3 px-4 rounded font-semibold"
                onClick={openAvailabilityCheck}
              >
                Check Now
              </button>
            </div>
          </form>
        </div>
    )
  }
export default ContactPage
