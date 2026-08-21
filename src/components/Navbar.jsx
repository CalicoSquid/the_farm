import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { UnreadContext } from "../context/unreadContext";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/from-the-farm", label: "From the Farm" },
  { to: "/dreams", label: "Dreams" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Updates", unread: true },
  { to: "/map", label: "Map" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unreadCount } = useContext(UnreadContext);
  const location = useLocation();

  // Route changes should always leave the navigation in a clean state.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-brand" aria-label="The Farm home">
          <span className="site-brand__name">I Bought a Farm</span>
          <span className="site-brand__place">Rijeka Crnojevića · Montenegro</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link--active" : ""}`
              }
            >
              {item.label}
              {item.unread && unreadCount > 0 && (
                <span className="nav-count" aria-label={`${unreadCount} unread updates`}>
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={`menu-trigger${isMenuOpen ? " menu-trigger--open" : ""}`}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
          <span />
          {unreadCount > 0 && !isMenuOpen && (
            <span className="menu-trigger__count">{unreadCount}</span>
          )}
        </button>
      </div>

      <div
        className={`mobile-nav${isMenuOpen ? " mobile-nav--open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className="mobile-nav__panel">
          <div className="mobile-nav__intro">
            <span className="mobile-nav__eyebrow">I bought a farm</span>
            <p>Old stone, wild land, and the long road back.</p>
          </div>

          <nav className="mobile-nav__links" aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `mobile-nav__link${isActive ? " mobile-nav__link--active" : ""}`
                }
              >
                <span className="mobile-nav__number">0{index + 1}</span>
                <span>{item.label}</span>
                {item.unread && unreadCount > 0 && (
                  <span className="nav-count">{unreadCount}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <p className="mobile-nav__footer">A very slow project in Montenegro.</p>
        </div>
      </div>
    </header>
  );
}
