import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About CraftWork Nepal</h3>
            <p>
              Handmade crafts and traditional goods from Nepal. Supporting local
              artisans and preserving cultural heritage.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/products">Products</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/cart">Cart</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-item">
              <MapPin size={18} />
              <span>Kathmandu, Nepal</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>+977 1234567890</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>info@craftwork.com</span>
            </div>
          </div>

          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 CraftWork Nepal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
