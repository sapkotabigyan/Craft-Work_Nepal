const API_URL = "http://localhost:4000/api/categories";

// Get all categories
export const getAllCategories = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
};

// Get category by ID
export const getCategoryById = async (id) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }
  return response.json();
};

// Create new category
export const createCategory = async (categoryData) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    throw new Error("Failed to create category");
  }
  return response.json();
};

// Update category
export const updateCategory = async (id, categoryData) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    throw new Error("Failed to update category");
  }
  return response.json();
};

// Delete category
export const deleteCategory = async (id) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
  return response.json();
};
