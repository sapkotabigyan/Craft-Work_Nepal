import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

// Create axios instance with default timeout to prevent infinite loading
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
});

const authAPI = {
  // Register new user
  register: (userData) => {
    return apiClient.post(`/api/auth/register`, userData);
  },

  // Login user
  login: (email, password) => {
    return apiClient.post(`/api/auth/login`, { email, password });
  },

  // Get current user
  getCurrentUser: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return apiClient.get(`/api/auth/init`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get user from localStorage
  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Set user and token
  setUserAndToken: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },

  // Update user profile
  updateProfile: (userData) => {
    const token = localStorage.getItem("token");
    return apiClient.patch(`/api/users/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Change password
  changePassword: (passwordData) => {
    const token = localStorage.getItem("token");
    return apiClient.post(`/api/users/change-password`, passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export default authAPI;
