import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import "../styles/checkout.css";

export default function Checkout({ cart, onClearCart }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Nepal",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const shipping = cart.length > 0 ? 100 : 0;
    return subtotal + shipping;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setErrors({ cart: "Your cart is empty" });
      return;
    }

    setLoading(true);

    try {
      // Create order object
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
        })),
        total: calculateTotal(),
        status: "pending",
        orderDate: new Date().toISOString(),
      };

      // Save order (you can send this to backend API)
      localStorage.setItem("lastOrder", JSON.stringify(orderData));

      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      localStorage.setItem("lastOrderId", orderId);

      // Clear cart
      onClearCart();

      // Redirect to confirmation page
      navigate("/order-confirmation", { state: { orderId, order: orderData } });
    } catch (error) {
      console.error("Error placing order:", error);
      setErrors({ submit: "Failed to place order. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = cart.length > 0 ? 100 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <section className="checkout-header">
          <h1>Checkout</h1>
        </section>
        <div className="checkout-container">
          <div className="empty-checkout">
            <p>Your cart is empty. Add items before checking out.</p>
            <Link to="/products" className="back-link">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="checkout-header">
        <h1>Checkout</h1>
      </section>

      <div className="checkout-container">
        <div className="checkout-content">
          {errors.submit && (
            <div className="error-message">
              <AlertCircle size={20} />
              <p>{errors.submit}</p>
            </div>
          )}

          {errors.cart && (
            <div className="error-message">
              <AlertCircle size={20} />
              <p>{errors.cart}</p>
            </div>
          )}

          {/* Checkout Form */}
          <div className="checkout-form-section">
            <h2>Shipping Information</h2>

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={errors.firstName ? "error" : ""}
                  />
                  {errors.firstName && (
                    <span className="error-text">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={errors.lastName ? "error" : ""}
                  />
                  {errors.lastName && (
                    <span className="error-text">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+977 98......"
                    className={errors.phone ? "error" : ""}
                  />
                  {errors.phone && (
                    <span className="error-text">{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className={errors.address ? "error" : ""}
                />
                {errors.address && (
                  <span className="error-text">{errors.address}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Kathmandu"
                    className={errors.city ? "error" : ""}
                  />
                  {errors.city && (
                    <span className="error-text">{errors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code *</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="44600"
                    className={errors.zipCode ? "error" : ""}
                  />
                  {errors.zipCode && (
                    <span className="error-text">{errors.zipCode}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="order-summary-sidebar">
          <h2>Order Summary</h2>

          <div className="order-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-details">
                  <p className="item-name">{item.product_name}</p>
                  <p className="item-qty">Qty: {item.quantity}</p>
                </div>
                <p className="item-price">
                  NPR {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>NPR {subtotal.toLocaleString()}</span>
          </div>

          <div className="summary-row">
            <span>Shipping:</span>
            <span>{shipping > 0 ? `NPR ${shipping}` : "Free"}</span>
          </div>

          <div className="summary-total">
            <span>Total:</span>
            <span>NPR {total.toLocaleString()}</span>
          </div>

          <Link to="/cart" className="back-to-cart">
            Back to Cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
