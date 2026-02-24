import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import OrderConfirmation from "./pages/OrderConfirmation";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import authAPI from "./services/authAPI";
import "./App.css";

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [user, setUser] = useState(() => {
    return authAPI.getStoredUser();
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return authAPI.isLoggedIn();
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleLogin = (userData, token) => {
    authAPI.setUserAndToken(userData, token);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setIsLoggedIn(false);
    setCart([]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Protected Route Component
  const ProtectedRoute = ({ element }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return element;
  };

  return (
    <Router>
      <div className="app">
        <Header
          cartCount={cart.length}
          user={user}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to="/products" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/register"
              element={
                isLoggedIn ? (
                  <Navigate to="/products" replace />
                ) : (
                  <Register onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/products"
              element={<Products onAddToCart={addToCart} user={user} />}
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  onRemoveFromCart={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                  onClearCart={clearCart}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute
                  element={
                    <Checkout cart={cart} onClearCart={clearCart} user={user} />
                  }
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={
                    <Profile user={user} onUpdateUser={handleUpdateUser} />
                  }
                />
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute element={<ChangePassword user={user} />} />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
