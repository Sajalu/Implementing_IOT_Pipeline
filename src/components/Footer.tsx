import type React from "react"
import { Link } from "react-router-dom"

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img
                src="https://static.vecteezy.com/system/resources/previews/009/428/828/non_2x/snow-cabin-in-winter-cartoon-icon-illustration-building-holidays-icon-concept-isolated-premium-flat-cartoon-style-vector.jpg"
                alt="Rakkaranta Logo"
                className="h-12 w-12 rounded-full"
              />
              <span className="text-xl font-semibold">Rakkaranta</span>
            </div>
            <p className="text-gray-400">Experience luxury living in the heart of nature.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/cottages" className="hover:text-white transition-colors">
                  Cottages
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-white transition-colors">
                  Activities
                </Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-white transition-colors">
                  Location
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Ukkohallantie 8</li>
              <li>89400 Hyrynsalmi</li>
              <li>Finland</li>
              <li>
                <a href="mailto:info@rakkaranta.fi" className="hover:text-white">
                  info@rakkaranta.fi
                </a>
              </li>
              <li>
                <a
                  href="https://www.rakkaranta.fi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Visit Our Website
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/people/Lomakyl%C3%A4-Rakkaranta/61560052920308/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/rakkaranta/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>Copyright © {new Date().getFullYear()} Rakkaranta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

