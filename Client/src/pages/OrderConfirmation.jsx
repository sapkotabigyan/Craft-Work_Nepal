import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Package, Truck } from "lucide-react";
import "../styles/order-confirmation.css";

export default function OrderConfirmation() {
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Get order data from navigation state or localStorage
    if (location.state?.orderId && location.state?.order) {
      setOrderId(location.state.orderId);
      setOrderData(location.state.order);
    } else {
      // Fallback to localStorage
      const savedOrderId = localStorage.getItem("lastOrderId");
      const savedOrder = localStorage.getItem("lastOrder");
      if (savedOrderId && savedOrder) {
        setOrderId(savedOrderId);
        setOrderData(JSON.parse(savedOrder));
      }
    }
  }, [location]);

  if (!orderData || !orderId) {
    return (
      <div className="confirmation-page">
        <section className="confirmation-header">
          <h1>Order Confirmation</h1>
        </section>
        <div className="confirmation-container">
          <div className="loading-state">
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  const orderDate = new Date(orderData.orderDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const estimatedDelivery = new Date(
    new Date(orderData.orderDate).getTime() + 7 * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="confirmation-page">
      <section className="confirmation-header">
        <h1>Order Confirmation</h1>
      </section>

      <div className="confirmation-container">
        <div className="success-banner">
          <CheckCircle size={64} className="success-icon" />
          <h2>Thank You for Your Order!</h2>
          <p>Your order has been successfully placed and is being prepared.</p>
        </div>

        <div className="confirmation-content">
          {/* Order Details Card */}
          <div className="order-details-card">
            <h3>Order Details</h3>

            <div className="detail-row">
              <span className="label">Order ID:</span>
              <span className="value order-id">{orderId}</span>
            </div>

            <div className="detail-row">
              <span className="label">Order Date:</span>
              <span className="value">{orderDate}</span>
            </div>

            <div className="detail-row">
              <span className="label">Status:</span>
              <span className="value status-badge pending">Pending</span>
            </div>

            <div className="detail-row">
              <span className="label">Estimated Delivery:</span>
              <span className="value">{estimatedDelivery}</span>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="shipping-card">
            <h3>Shipping Information</h3>

            <div className="shipping-info">
              <p className="customer-name">
                {orderData.customer.firstName} {orderData.customer.lastName}
              </p>
              <p>{orderData.customer.address}</p>
              <p>
                {orderData.customer.city}, {orderData.customer.zipCode}
              </p>
              <p>{orderData.customer.country}</p>
            </div>

            <div className="contact-info">
              <p>
                <span className="label">Email:</span> {orderData.customer.email}
              </p>
              <p>
                <span className="label">Phone:</span> {orderData.customer.phone}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-card">
            <h3>Order Items ({orderData.items.length})</h3>

            <div className="items-list">
              {orderData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-category">{item.category}</p>
                  </div>
                  <p className="item-qty">x{item.quantity}</p>
                  <p className="item-subtotal">
                    NPR {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="items-divider"></div>

            <div className="item-row total">
              <div></div>
              <p>Total:</p>
              <p className="total-amount">
                NPR {orderData.total.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="timeline-card">
            <h3>Order Timeline</h3>

            <div className="timeline">
              <div className="timeline-step completed">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <p className="timeline-title">Order Placed</p>
                  <p className="timeline-date">{orderDate}</p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <p className="timeline-title">Processing</p>
                  <p className="timeline-date">1-2 business days</p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <p className="timeline-title">Shipped</p>
                  <p className="timeline-date">
                    You'll receive a tracking number
                  </p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <p className="timeline-title">Delivered</p>
                  <p className="timeline-date">Expected: {estimatedDelivery}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps-card">
            <h3>What's Next?</h3>

            <div className="steps-list">
              <div className="step">
                <Truck size={24} />
                <p>
                  You'll receive an email confirmation and tracking details once
                  your order ships.
                </p>
              </div>

              <div className="step">
                <Package size={24} />
                <p>Keep your order ID ({orderId}) for easy reference.</p>
              </div>

              <div className="step">
                <CheckCircle size={24} />
                <p>
                  Track your package in real-time using your tracking number.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary">
              Print Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
