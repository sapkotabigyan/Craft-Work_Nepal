import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import "../styles/cart.css";

export default function Cart({
  cart,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
}) {
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const shippingCost = cart.length > 0 ? 100 : 0;
  const subtotal = calculateSubtotal();
  const total = subtotal + shippingCost;

  return (
    <div className="cart-page">
      <section className="cart-header">
        <h1>Shopping Cart</h1>
      </section>

      <div className="cart-container">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-content">
              <h2>Your cart is empty</h2>
              <p>Explore our collection and find something you love!</p>
              <Link to="/products" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items">
              <h2>Items ({cart.length})</h2>

              <div className="items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.product_name} />
                      ) : (
                        <div className="image-placeholder">No Image</div>
                      )}
                    </div>

                    <div className="item-details">
                      <h3>{item.product_name}</h3>
                      <p className="item-category">{item.category}</p>
                      <p className="item-price">NPR {item.price}</p>
                    </div>

                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="qty-btn">
                        <Minus size={18} />
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="qty-btn">
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className="item-total">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </div>

                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="remove-btn"
                      title="Remove item">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={onClearCart} className="clear-cart-btn">
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <aside className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>NPR {subtotal.toLocaleString()}</span>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shippingCost > 0 ? `NPR ${shippingCost}` : "Free"}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total:</span>
                <span>NPR {total.toLocaleString()}</span>
              </div>

              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>

              <Link to="/products" className="continue-shopping-link">
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
