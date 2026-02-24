import React, { useState } from "react";
import { Eye, EyeOff, Shield, User, Lock } from "lucide-react";
import "../../Styles/Adminlogin.css";

// Custom useForm hook
const useCustomForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (onSubmit) => {
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};

// Validation function
const validateForm = (values) => {
  const errors = {};

  if (!values.username.trim()) {
    errors.username = "Username is required";
  } else if (values.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

// Main AdminLogin Component
const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState("");

  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useCustomForm({ username: "", password: "" }, validateForm);

  const onSubmit = async (formData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock validation
    if (formData.username === "admin" && formData.password === "admin123") {
      setLoginStatus("success");
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect to dashboard
      }, 1000);
    } else {
      setLoginStatus("error");
    }
  };

  const handleFormSubmit = () => {
    setLoginStatus("");
    handleSubmit(onSubmit);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-overlay"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <Shield className="logo-icon" size={32} />
          </div>
          <h1 className="login-title">Admin Portal</h1>
          <p className="login-subtitle">Sign in to access the dashboard</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-container">
              <User className="input-icon" size={20} />
              <input
                type="text"
                id="username"
                name="username"
                value={values.username}
                onChange={handleChange}
                className={`form-input ${errors.username ? "input-error" : ""}`}
                placeholder="Enter your username"
                disabled={isSubmitting}
              />
            </div>
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-container">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "input-error" : ""}`}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                disabled={isSubmitting}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" className="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? "loading" : ""}`}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          {loginStatus === "success" && (
            <div className="status-message success">
              Login successful! Redirecting...
            </div>
          )}

          {loginStatus === "error" && (
            <div className="status-message error">
              Invalid credentials. Try admin/admin123
            </div>
          )}
        </div>

        <div className="login-footer">
          <p>© 2025 Admin Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
