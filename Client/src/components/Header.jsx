import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Home,
  Package,
  Info,
  LogOut,
  User,
} from "lucide-react";
import "../styles/header.css";

const Header = ({ cartCount, user, onLogout, isLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            🎨 CraftWork Nepal
          </Link>

          <nav className={`nav ${isMobileMenuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-link">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/products" className="nav-link">
              <Package size={18} />
              <span>Products</span>
            </Link>
            <Link to="/about" className="nav-link">
              <Info size={18} />
              <span>About</span>
            </Link>
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-link">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {isLoggedIn && user ? (
              <div className="user-menu">
                <div className="user-info">
                  <User size={18} />
                  <span className="user-name">
                    {user.firstName || user.email}
                  </span>
                </div>
                <Link to="/profile" className="profile-btn">
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    navigate("/");
                  }}
                  className="logout-btn">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="login-btn">
                  Login
                </Link>
                <Link to="/register" className="register-btn">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="mobile-nav">
            <button
              onClick={() => handleNavClick("/")}
              className="mobile-nav-link">
              Home
            </button>
            <button
              onClick={() => handleNavClick("/products")}
              className="mobile-nav-link">
              Products
            </button>
            <button
              onClick={() => handleNavClick("/about")}
              className="mobile-nav-link">
              About
            </button>
            <button
              onClick={() => handleNavClick("/cart")}
              className="mobile-nav-link">
              Cart ({cartCount})
            </button>
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => handleNavClick("/login")}
                  className="mobile-nav-link">
                  Login
                </button>
                <button
                  onClick={() => handleNavClick("/register")}
                  className="mobile-nav-link">
                  Sign Up
                </button>
              </>
            )}
            {isLoggedIn && (
              <>
                <button
                  onClick={() => handleNavClick("/profile")}
                  className="mobile-nav-link">
                  Profile
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                    navigate("/");
                  }}
                  className="mobile-nav-link logout">
                  Logout
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
