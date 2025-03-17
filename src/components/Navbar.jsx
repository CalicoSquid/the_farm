import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logofarm2.png";

export default function Navbar() {
  // State to handle the mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex justify-between items-center p-4 relative z-50">
      {/* Logo */}
      <Link to="/">
      <img src={logo} className={ isMenuOpen ? "logo h-16 w-0 transition-all duration-300 ease-in-out" : "logo h-16 w-fulltransition-all duration-300 ease-in-out "} alt="Logo" /> 
      </Link> 
      {/* Hamburger Icon (Visible only on small screens) */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 rounded-md focus:outline-none hamburger"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Desktop Navbar (Visible only on large screens) */}
      <ul className="hidden lg:flex space-x-4 justify-center">
        <li>
          <Link to="/" className="tab">Home</Link>
        </li>
        <li>
          <Link to="/gallery" className="tab">Gallery</Link>
        </li>
        <li>
          <Link to="/blog" className="tab">Updates</Link>
        </li>
        <li>
          <Link to="/map" className="tab">Map</Link>
        </li>
      </ul>

      {/* Mobile Menu (Visible only when hamburger is clicked) */}
      <div
        className={` menu lg:hidden absolute top-0 left-0 w-full p-4 transition-all duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } z-50 bg-opacity-50`} 
      >
        <img src={logo} className="logo h-16" alt="Logo" />
        <ul className="flex flex-col space-y-4">
          <li>
            <Link to="/" className="tab" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/gallery" className="tab" onClick={() => setIsMenuOpen(false)}>
              Gallery
            </Link>
          </li>
          <li>
            <Link to="/blog" className="tab" onClick={() => setIsMenuOpen(false)}>
              Updates
            </Link>
          </li>
          <li>
            <Link to="/map" className="tab" onClick={() => setIsMenuOpen(false)}>
              Map
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
