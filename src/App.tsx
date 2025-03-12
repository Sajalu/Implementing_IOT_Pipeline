import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginModal from './components/LoginModal';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CottagesPage from './pages/CottagesPage';
import ActivitiesPage from './pages/ActivitiesPage';
import LocationPage from './pages/LocationPage';
import ContactPage from './pages/ContactPage';
import Footer from './components/Footer';

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
        <Navbar isScrolled={isScrolled} onLoginClick={() => setIsLoginOpen(true)} />

        {/* Main Content */}
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cottages" element={<div className="pt-16"><CottagesPage /></div>} />
            <Route path="/activities" element={<div className="pt-16"><ActivitiesPage /></div>} />
            <Route path="/location" element={<div className="pt-16"><LocationPage /></div>} />
            <Route path="/contact" element={<div className="pt-16"><ContactPage /></div>} />
          </Routes>
        </div>

        {/* Login Modal */}
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
          {/* Footer Component */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;