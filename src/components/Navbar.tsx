import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Login from './Login'; // Ensure this path is correct

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false); // State for role selection modal
  const [showLogin, setShowLogin] = useState(false); // State for login modal
  const [userType, setUserType] = useState<'guest' | 'admin'>('guest'); // State to store selected user type

  const handleRoleSelection = (role: 'guest' | 'admin') => {
    console.log(`Role selected: ${role}`); // Debugging
    setUserType(role); // Set the selected role
    setShowRoleSelection(false); // Close the role selection modal
    setShowLogin(true); // Open the login modal
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-[#2A5A4B]">Rakkaranta</div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#2A5A4B]"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-[#2A5A4B]">Home</a>
            <a href="#rooms" className="text-gray-700 hover:text-[#2A5A4B]">Rooms</a>
            <a href="#amenities" className="text-gray-700 hover:text-[#2A5A4B]">Amenities</a>
            <a href="#contact" className="text-gray-700 hover:text-[#2A5A4B]">Contact</a>
            <button 
              onClick={() => {
                console.log("Login button clicked"); // Debugging
                setShowRoleSelection(true);
              }} 
              className="px-4 py-2 bg-[#2A5A4B] text-white rounded-lg hover:bg-[#1d4235] transition-colors"
            >
              Login
            </button>
            <div className="flex space-x-2">
              <button className="px-2 py-1 rounded bg-[#2A5A4B] text-white">EN</button>
              <button className="px-2 py-1 rounded hover:bg-gray-100">FI</button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-[#2A5A4B]">Home</a>
              <a href="#rooms" className="block px-3 py-2 text-gray-700 hover:text-[#2A5A4B]">Rooms</a>
              <a href="#amenities" className="block px-3 py-2 text-gray-700 hover:text-[#2A5A4B]">Amenities</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-[#2A5A4B]">Contact</a>
              <button 
                onClick={() => {
                  console.log("Login button clicked (mobile)"); // Debugging
                  setShowRoleSelection(true);
                }} 
                className="block w-full px-3 py-2 text-left bg-[#2A5A4B] text-white rounded-lg hover:bg-[#1d4235] transition-colors"
              >
                Login
              </button>
              <div className="flex space-x-2 px-3 py-2">
                <button className="px-2 py-1 rounded bg-[#2A5A4B] text-white">EN</button>
                <button className="px-2 py-1 rounded hover:bg-gray-100">FI</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Role Selection Modal */}
      {showRoleSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 relative w-96">
            <button 
              onClick={() => setShowRoleSelection(false)} 
              className="absolute top-2 right-2 text-gray-700 hover:text-[#2A5A4B]"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-[#2A5A4B] mb-6">Select Login Type</h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  console.log("Guest selected"); // Debugging
                  handleRoleSelection('guest');
                }}
                className="px-6 py-3 bg-[#2A5A4B] text-white rounded-lg hover:bg-[#1d4235] transition-colors"
              >
                Login as Guest
              </button>
              <button
                onClick={() => {
                  console.log("Admin selected"); // Debugging
                  handleRoleSelection('admin');
                }}
                className="px-6 py-3 bg-[#2A5A4B] text-white rounded-lg hover:bg-[#1d4235] transition-colors"
              >
                Login as Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 relative">
            <button 
              onClick={() => setShowLogin(false)} 
              className="absolute top-2 right-2 text-gray-700 hover:text-[#2A5A4B]"
            >
              &times;
            </button>
            <Login userType={userType} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;