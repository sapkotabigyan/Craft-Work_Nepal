import React, { useState, useEffect } from "react";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../../services/categoryApi";
import Sidebar from "../../components/Sidebar";
import "../../Styles/Product.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ category_name: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load categories");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.categoryId, formData);
      } else {
        await createCategory(formData);
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ category_name: "" });
      fetchCategories();
    } catch (err) {
      setError("Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        setError("Failed to delete category");
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ category_name: category.category_name });
    setShowModal(true);
  };

  const openModal = () => {
    setEditingCategory(null);
    setFormData({ category_name: "" });
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading categories...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">Categories Management</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="table-container">
          <div className="table-header">
            <h2>All Categories</h2>
            <button className="btn btn-primary" onClick={openModal}>
              + Add New Category
            </button>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.categoryId}>
                    <td>{category.categoryId}</td>
                    <td className="category-name">{category.category_name}</td>
                    <td>
                      <button 
                        className="btn btn-edit" 
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-delete" 
                        onClick={() => handleDelete(category.categoryId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">No categories found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingCategory ? "Edit Category" : "Add New Category"}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    value={formData.category_name}
                    onChange={(e) => setFormData({ category_name: e.target.value })}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingCategory ? "Update" : "Create"}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Categories;
