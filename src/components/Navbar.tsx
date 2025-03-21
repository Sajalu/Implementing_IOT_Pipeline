"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Home, Mouse as House, Waves, MapPin, Phone, UserCircle2 } from "lucide-react"

interface NavbarProps {
  isScrolled: boolean
  onLoginClick: () => void
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  const navbarBackground = isHomePage
    ? isScrolled
      ? "bg-gradient-to-r from-blue-600/90 via-blue-500/90 to-cyan-500/90 backdrop-blur-sm shadow-lg"
      : "bg-transparent"
    : "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-lg"

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navbarBackground}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Updated logo with the provided image */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src="https://static.vecteezy.com/system/resources/previews/009/428/828/non_2x/snow-cabin-in-winter-cartoon-icon-illustration-building-holidays-icon-concept-isolated-premium-flat-cartoon-style-vector.jpg"
                alt="Rakkaranta Logo"
                className="h-10 w-auto rounded-full"
              />
              <span className="ml-2 text-xl font-bold text-white">Rakkaranta</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <NavLink to="/" icon={<Home className="h-4 w-4" />} text="Home" />
            <NavLink to="/cottages" icon={<House className="h-4 w-4" />} text="Cottages" />
            <NavLink to="/activities" icon={<Waves className="h-4 w-4" />} text="Activities" />
            <NavLink to="/location" icon={<MapPin className="h-4 w-4" />} text="Location" />
            <NavLink to="/contact" icon={<Phone className="h-4 w-4" />} text="Contact" />
            <button
              onClick={onLoginClick}
              className="flex items-center space-x-1 px-4 py-2 rounded-md text-white hover:bg-white/20 transition-colors ml-2"
            >
              <UserCircle2 className="h-4 w-4" />
              <span>Login</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" icon={<Home className="h-4 w-4" />} text="Home" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink
              to="/cottages"
              icon={<House className="h-4 w-4" />}
              text="Cottages"
              setIsMenuOpen={setIsMenuOpen}
            />
            <MobileNavLink
              to="/activities"
              icon={<Waves className="h-4 w-4" />}
              text="Activities"
              setIsMenuOpen={setIsMenuOpen}
            />
            <MobileNavLink
              to="/location"
              icon={<MapPin className="h-4 w-4" />}
              text="Location"
              setIsMenuOpen={setIsMenuOpen}
            />
            <MobileNavLink
              to="/contact"
              icon={<Phone className="h-4 w-4" />}
              text="Contact"
              setIsMenuOpen={setIsMenuOpen}
            />
            <button
              onClick={() => {
                onLoginClick()
                setIsMenuOpen(false)
              }}
              className="flex items-center w-full px-4 py-2 text-blue-600 hover:bg-blue-50"
            >
              <UserCircle2 className="h-4 w-4 mr-2" />
              <span>Login</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ icon, text, to }: { icon: React.ReactNode; text: string; to: string }) {
  return (
    <Link
      to={to}
      className="flex items-center space-x-1 px-4 py-2 rounded-md text-white hover:bg-white/20 transition-colors"
    >
      {icon}
      <span>{text}</span>
    </Link>
  )
}

interface MobileNavLinkProps {
  icon: React.ReactNode
  text: string
  to: string
  setIsMenuOpen: (isOpen: boolean) => void
}

function MobileNavLink({ icon, text, to, setIsMenuOpen }: MobileNavLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50"
      onClick={() => {
        document.body.style.overflow = "auto"
        setIsMenuOpen(false)
      }}
    >
      {icon}
      <span className="ml-2">{text}</span>
    </Link>
  )
}

export default Navbar

