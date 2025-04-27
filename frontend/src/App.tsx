// Fixed App.tsx
// File path: ./client/src/App.tsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginModal from './components/LoginModal';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CottagesPage from './pages/CottagesPage';
import ActivitiesPage from './pages/ActivitiesPage';
import LocationPage from './pages/LocationPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import Footer from './components/Footer';
import BookForm from './pages/BookForm'; // Import the BookForm component
import { isAuthenticated, isAdmin } from './utils/auth';

// Protected Route component that checks if user is authenticated and has admin role
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    // Not logged in, redirect to home
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin()) {
    // Not an admin, redirect to home
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and is an admin
  return <>{children}</>;
};

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Admin route wrapped in ProtectedRoute */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          
          {/* BookForm route */}
          <Route path="/book" element={<BookForm />} />

          {/* All other routes include the regular layout */}
          <Route
            path="/*"
            element={
              <>
                <Navbar isScrolled={isScrolled} onLoginClick={() => setIsLoginOpen(true)} />
                <div className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/cottages"
                      element={
                        <div className="pt-16">
                          <CottagesPage />
                        </div>
                      }
                    />
                    <Route
                      path="/activities"
                      element={
                        <div className="pt-16">
                          <ActivitiesPage />
                        </div>
                      }
                    />
                    <Route
                      path="/location"
                      element={
                        <div className="pt-16">
                          <LocationPage />
                        </div>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <div className="pt-16">
                          <ContactPage />
                        </div>
                      }
                    />
                  </Routes>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>

        {/* Login Modal */}
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </Router>
  );
}

export default App;