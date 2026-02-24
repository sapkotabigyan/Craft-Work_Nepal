const API_URL = "http://localhost:4000/api/users";

// Get all users
export const getAllUsers = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

// Get user by ID
export const getUserById = async (id) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
};

// Create new user
export const createUser = async (userData) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error("Failed to create user");
  }
  return response.json();
};

// Update user
export const updateUser = async (id, userData) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return response.json();
};

// Delete user
export const deleteUser = async (id) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  return response.json();
};
