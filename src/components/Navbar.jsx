import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UnreadContext } from "../context/unreadContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unreadCount } = useContext(UnreadContext);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="flex justify-between items-center p-4 relative z-50">
      {/* Logo */}
      <Link to="/">
        {!isMenuOpen && <h1 className="h2-text logo">The Farm</h1>}
      </Link>

      {/* Hamburger Icon */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 rounded-md focus:outline-none relative hamburger"
        aria-label="Toggle menu"
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
        {unreadCount > 0 && (
          <span className="absolute unread-indicator -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Desktop Navbar */}
      <ul className="hidden lg:flex space-x-4 justify-center">
        <li>
          <Link to="/" className="tab">
            Home
          </Link>
        </li>
        <li>
          <Link to="/gallery" className="tab">
            Gallery
          </Link>
        </li>
        <li>
          <Link to="/blog" className="tab relative">
            Updates{" "}
            {unreadCount > 0 && (
              <span className="exclamation unread-indicator full">
                {" "}
                {unreadCount}{" "}
              </span>
            )}
          </Link>
        </li>
        <li>
          <Link to="/map" className="tab">
            Map
          </Link>
        </li>
      </ul>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden mobile-menu fixed top-0 left-0 bottom w-full h-screen bg-[#f8f4ec] shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 p-2 rounded-md focus:outline-none"
          aria-label="Close menu"
        >
          ✖
        </button>
        <h1 className="h2-text logo mb-4">The Farm</h1>
        <ul className="flex flex-col space-y-4">
          <li>
            <Link to="/" className="tab" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/gallery"
              className="tab"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              to="/blog"
              className="tab relative "
              onClick={() => setIsMenuOpen(false)}
            >
              Updates{" "}
              {unreadCount > 0 && (
                <span className="exclamation unread-indicator">
                  {" "}
                  {unreadCount}{" "}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/map"
              className="tab"
              onClick={() => setIsMenuOpen(false)}
            >
              Map
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
