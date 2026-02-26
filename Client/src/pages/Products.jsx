import { useState, useEffect } from "react";
import { ShoppingCart, Search, Loader } from "lucide-react";
import axios from "axios";
import "../styles/products.css";

export default function Products({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { name: "all", label: "All Products" },
    { name: "wooden crafts", label: "Wooden Crafts" },
    { name: "handmade", label: "Handmade" },
    { name: "traditional", label: "Traditional" },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("Fetching products from API...");
      const response = await axios.get("http://localhost:4000/api/product");
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      
      const productsData = Array.isArray(response.data) ? response.data : [];
      console.log("Products array:", productsData);
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setError(null);
    } catch (err) {
      setError("Failed to load products: " + (err.message || "Unknown error"));
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = products;

    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const handleAddToCart = (product) => {
    onAddToCart(product);
    // Show a brief feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = "Added! ✓";
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  };

  return (
    <div className="products-page">
      <section className="products-header">
        <h1>Our Products</h1>
        <p>Discover our collection of authentic handmade crafts from Nepal</p>
      </section>

      <div className="products-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Search</h3>
            <div className="search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`filter-btn ${selectedCategory === cat.name ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.name)}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-info">
            <p>
              Products found: <strong>{filteredProducts.length}</strong>
            </p>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="products-main">
          {loading ? (
            <div className="loading-state">
              <Loader size={48} className="spinner" />
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchProducts} className="retry-btn">
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>No products found</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="reset-btn">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <div className="image-placeholder">No Image</div>
                    )}
                    {product.category && (
                      <span className="category-badge">{product.category}</span>
                    )}
                  </div>

                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="description">
                      {product.description || "No description available"}
                    </p>

                    <div className="product-footer">
                      <div className="price-section">
                        <span className="price">
                          NPR {product.price || "0"}
                        </span>
                      </div>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}>
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
