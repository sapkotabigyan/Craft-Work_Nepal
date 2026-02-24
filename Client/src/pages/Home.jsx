import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Heart, Globe } from "lucide-react";
import "../styles/home.css";

const Home = () => {
  const features = [
    {
      icon: <Heart size={32} />,
      title: "Handmade Quality",
      description:
        "Authentic handcrafted products made with love and dedication",
    },
    {
      icon: <Globe size={32} />,
      title: "Worldwide Shipping",
      description: "We ship our products to customers worldwide",
    },
    {
      icon: <Zap size={32} />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep",
    },
  ];

  const categories = [
    { name: "Wooden", emoji: "🪵", color: "#8B5A3C" },
    { name: "Handmade", emoji: "✋", color: "#D4A574" },
    { name: "Traditional", emoji: "🎭", color: "#6B4423" },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to CraftWork Nepal</h1>
            <p>
              Discover Authentic Handmade Crafts & Traditional Goods from Nepal
            </p>
            <Link to="/products" className="hero-btn">
              Shop Now
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="hero-image">
            <div className="hero-decoration">🎨</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="category-card"
                style={{ "--card-color": category.color }}>
                <div className="category-emoji">{category.emoji}</div>
                <h3>{category.name}</h3>
                <span className="arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">Customer Stories</h2>
          <div className="testimonials-grid">
            {[
              {
                name: "Sarah Johnson",
                text: "Amazing quality products! The craftsmanship is incredible and everything arrived perfectly packed.",
                rating: 5,
              },
              {
                name: "Rajesh Kumar",
                text: "Love supporting local artisans. The products tell stories and represent Nepal beautifully.",
                rating: 5,
              },
              {
                name: "Emily Chen",
                text: "Fast shipping and excellent customer service. Will definitely order again!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <p className="testimonial-author">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Shop?</h2>
          <p>Browse our collection of authentic handmade crafts</p>
          <Link to="/products" className="cta-btn">
            Explore Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
