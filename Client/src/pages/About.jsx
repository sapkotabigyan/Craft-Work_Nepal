import { Users, Award, Leaf, Heart } from "lucide-react";
import "../styles/about.css";

export default function About() {
  return (
    <div className="about-page">
      {/* About Header */}
      <section className="about-header">
        <h1>About CraftWork Nepal</h1>
        <p>
          Celebrating authentic handcrafted traditions from the heart of Nepal
        </p>
      </section>

      {/* Story Section */}
      <section className="content-section about-story">
        <div className="section-content">
          <div className="text-content">
            <h2>Our Story</h2>
            <p>
              CraftWork Nepal was founded on the belief that authentic handmade
              crafts represent not just products, but the passion, dedication,
              and cultural heritage of artisans from Nepal. What started as a
              small initiative to support local craftspeople has grown into a
              thriving platform connecting traditional artisans with customers
              worldwide.
            </p>
            <p>
              Every item in our collection tells a story—a story of skilled
              hands shaping raw materials into beautiful pieces, of generations
              passing down traditional techniques, and of communities preserving
              their unique cultural identity. We are proud to be a bridge
              between these talented artisans and the global community that
              appreciates their work.
            </p>
          </div>

          <div className="story-stats">
            <div className="stat-card">
              <h3>500+</h3>
              <p>Artisans & Craftspeople</p>
            </div>
            <div className="stat-card">
              <h3>10,000+</h3>
              <p>Happy Customers Worldwide</p>
            </div>
            <div className="stat-card">
              <h3>25+</h3>
              <p>Years of Tradition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="content-section values-section">
        <h2>Our Mission & Values</h2>

        <div className="values-grid">
          <div className="value-card">
            <Heart size={40} />
            <h3>Authentic Craftsmanship</h3>
            <p>
              We believe in preserving and promoting genuine handcrafted
              products that reflect the true artistry and heritage of Nepal.
            </p>
          </div>

          <div className="value-card">
            <Users size={40} />
            <h3>Support Local Artisans</h3>
            <p>
              Our mission is to provide fair compensation and sustainable
              livelihoods for talented craftspeople and their families.
            </p>
          </div>

          <div className="value-card">
            <Award size={40} />
            <h3>Quality First</h3>
            <p>
              Every product undergoes rigorous quality checks to ensure you
              receive only the finest handcrafted items.
            </p>
          </div>

          <div className="value-card">
            <Leaf size={40} />
            <h3>Sustainability</h3>
            <p>
              We are committed to eco-friendly practices and sustainable
              production methods that respect our environment.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="content-section categories-section">
        <h2>Our Product Categories</h2>

        <div className="categories-detailed">
          <div className="category-detail">
            <div className="category-emoji">🪵</div>
            <h3>Wooden Crafts</h3>
            <p>
              Beautifully carved wooden items showcasing intricate designs and
              traditional woodworking techniques passed down through
              generations.
            </p>
          </div>

          <div className="category-detail">
            <div className="category-emoji">✋</div>
            <h3>Handmade Creations</h3>
            <p>
              Unique handcrafted pieces meticulously created by skilled artisans
              using traditional methods and premium materials.
            </p>
          </div>

          <div className="category-detail">
            <div className="category-emoji">🏛️</div>
            <h3>Traditional Goods</h3>
            <p>
              Authentic traditional products that represent Nepal's rich
              cultural heritage and time-honored craftsmanship traditions.
            </p>
          </div>
        </div>
      </section>

      {/* Artisans Section */}
      <section className="content-section artisans-section">
        <h2>Meet Our Artisans</h2>
        <p className="section-subtitle">
          Behind every product is a talented artisan with passion and dedication
          to their craft. Our artisans come from various regions of Nepal and
          maintain the traditional techniques that have been part of the
          country's cultural identity for centuries.
        </p>

        <div className="artisans-grid">
          <div className="artisan-card">
            <div className="artisan-image">👨‍🎨</div>
            <h3>Master Carvers</h3>
            <p>
              Expert woodworkers specializing in intricate wooden sculptures and
              decorative pieces.
            </p>
          </div>

          <div className="artisan-card">
            <div className="artisan-image">👩‍🌾</div>
            <h3>Weavers & Textile Artists</h3>
            <p>
              Skilled weavers creating beautiful textiles using traditional
              looms and natural dyes.
            </p>
          </div>

          <div className="artisan-card">
            <div className="artisan-image">🎭</div>
            <h3>Traditional Craftspeople</h3>
            <p>
              Artisans preserving ancient techniques in pottery, metalwork, and
              traditional crafts.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="content-section why-choose-us">
        <h2>Why Choose CraftWork Nepal?</h2>

        <div className="benefits-list">
          <div className="benefit">
            <span className="benefit-icon">✓</span>
            <div>
              <h4>Authentic & Original</h4>
              <p>
                Every product is genuinely handmade with no mass production.
                Each item is unique.
              </p>
            </div>
          </div>

          <div className="benefit">
            <span className="benefit-icon">✓</span>
            <div>
              <h4>Fair Trade Certified</h4>
              <p>
                We ensure artisans receive fair compensation for their work and
                skills.
              </p>
            </div>
          </div>

          <div className="benefit">
            <span className="benefit-icon">✓</span>
            <div>
              <h4>Quality Assurance</h4>
              <p>
                All products are carefully inspected to meet our high quality
                standards.
              </p>
            </div>
          </div>

          <div className="benefit">
            <span className="benefit-icon">✓</span>
            <div>
              <h4>Eco-Friendly Packaging</h4>
              <p>
                We use sustainable and recyclable packaging materials for all
                shipments.
              </p>
            </div>
          </div>

          <div className="benefit">
            <span className="benefit-icon">✓</span>
            <div>
              <h4>Worldwide Shipping</h4>
              <p>Fast and reliable shipping to customers across the globe.</p>
            </div>
          </div>

          <div className="benefit">
            <span className="benefit-icon">✓</span>
            <div>
              <h4>Customer Support</h4>
              <p>
                Dedicated support team to help with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="content-section contact-cta">
        <h2>Get in Touch</h2>
        <p>
          Have questions about our products or want to collaborate with us? We'd
          love to hear from you.
        </p>
        <div className="contact-buttons">
          <button className="contact-btn email">
            📧 <span>Email Us</span>
          </button>
          <button className="contact-btn phone">
            📞 <span>Call Us</span>
          </button>
          <button className="contact-btn social">
            💬 <span>Follow Us</span>
          </button>
        </div>
      </section>
    </div>
  );
}
