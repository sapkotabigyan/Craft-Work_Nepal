import React, { useEffect, useState } from "react";
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ShoppingCart,
  Star,
  Filter,
  Upload,
} from "lucide-react";
import "../../Styles/Product.css";
import Sidebar from "../../components/Sidebar";
import {
  deleteProduct,
  getAllProducts,
  uploadProduct,
} from "../../services/productApi";

// Custom useForm hook
const useForm = (initialValues, validate) => {
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

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
  };
};

// Validation function for handicraft form
const validateHandicraft = (values) => {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = "Handicraft name is required";
  } else if (values.name.length < 3) {
    errors.name = "Handicraft name must be at least 3 characters";
  }
  if (!values.code.trim()) {
    errors.code = "Handicraft code is required";
  } else if (values.code.length < 3) {
    errors.code = "Handicraft code must be at least 3 characters";
  }
  if (!values.price || values.price <= 0) {
    errors.price = "Price must be greater than 0";
  }
  if (!values.category.trim()) {
    errors.category = "Category is required";
  }
  if (!values.stock || values.stock < 0) {
    errors.stock = "Stock cannot be negative";
  }
  return errors;
};

// Main Handicraft Component
const Handicraft = () => {
  const [handicrafts, setHandicrafts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHandicraft, setEditingHandicraft] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'li
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchHandicrafts = async () => {
      try {
        const response = await getAllProducts(); // Call as a function
        console.log("Fetched handicrafts:", response);
        if (response.status === 200) {
          setHandicrafts(response.data);
        } else {
          console.error("Failed to fetch handicrafts"); // Handle error appropriately
        }
      } catch (error) {
        console.error("Error fetching handicrafts:", error);
      }
    };
    fetchHandicrafts();
  }, []);
  const initialFormValues = {
    name: "",
    code: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit, reset } =
    useForm(initialFormValues, validateHandicraft);

  // Categories for filter
  const categories = [...new Set(handicrafts?.map((h) => h.category))];

  // Filtered handicrafts
  const filteredHandicrafts = handicrafts?.filter((handicraft) => {
    const matchesSearch =
      handicraft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      handicraft.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || handicraft.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openModal = (handicraft = null) => {
    if (handicraft) {
      setEditingHandicraft(handicraft);
      // Populate form with handicraft data for editing
      Object.keys(initialFormValues).forEach((key) => {
        if (handicraft[key] !== undefined) {
          handleChange({ target: { name: key, value: handicraft[key] } });
        }
      });
      setImagePreview(handicraft.image || "");
    } else {
      setEditingHandicraft(null);
      reset();
      setImagePreview("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHandicraft(null);
    reset();
    setImagePreview("");
  };

  const onSubmit = async (formData) => {
    try {
      // Prepare FormData for file upload
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("code", formData.code);
      fd.append("price", formData.price);
      fd.append("category", formData.category);
      fd.append("stock", formData.stock);
      fd.append("description", formData.description);
      if (formData.image && formData.image instanceof File) {
        fd.append("image", formData.image);
      }
      // Send to backend
      const response = await uploadProduct(fd);
      if (response.status === 201) {
        // Refresh product list from server to get accurate data
        const refreshed = await getAllProducts();
        if (refreshed.status === 200) {
          setHandicrafts(refreshed.data);
        }
        closeModal();
        alert("Product added successfully!");
      } else {
        alert("Failed to upload product. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        "Error uploading product. Please check your connection and try again.",
      );
    }
  };
  // Handle image file input and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      handleChange({ target: { name: "image", value: file } });
    }
  };

  const deleteHandicraft = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await deleteProduct(id);
      if (res.status === 200) {
        setHandicrafts((prev) => prev.filter((h) => h.id !== id));
        alert("Handicraft deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting handicraft:", error);
      alert("Failed to delete handicraft. Please try again.");
    }
  };

  const handleFormSubmit = () => {
    handleSubmit(onSubmit);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="product-container">
        <div className="product-header">
          <div className="header-content">
            <div className="title-section">
              <Package className="header-icon" size={32} />
              <div>
                <h1 className="page-title">KalaBazzer Product Management</h1>
                <p className="page-subtitle">
                  Manage your handicraft inventory
                </p>
              </div>
            </div>
            <button onClick={() => openModal()} className="add-button">
              <Plus size={20} />
              Add Handicraft
            </button>
          </div>
          <div className="controls-section">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search handicrafts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-container">
              <Filter className="filter-icon" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select">
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="view-toggle">
              <button
                onClick={() => setViewMode("grid")}
                className={`view-button ${viewMode === "grid" ? "active" : ""}`}>
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`view-button ${viewMode === "list" ? "active" : ""}`}>
                List
              </button>
            </div>
          </div>
        </div>
        <div className={`products-grid ${viewMode}`}>
          {filteredHandicrafts?.map((handicraft) => (
            <div key={handicraft.id} className="product-card">
              <div className="product-image">
                <img src={`${handicraft.imageUrl}`} alt={handicraft.name} />
                <div className="product-overlay">
                  <button
                    onClick={() => openModal(handicraft)}
                    className="overlay-button edit">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteHandicraft(handicraft.id)}
                    className="overlay-button delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="product-info">
                <div className="product-header-card">
                  <h3 className="product-name">{handicraft.name}</h3>
                  <span className="product-code">{handicraft.code}</span>
                </div>
                <p className="product-description">{handicraft.description}</p>
                <div className="product-details">
                  <div className="price-section">
                    <span className="price">${handicraft.price}</span>
                    <span className="category">{handicraft.category}</span>
                  </div>
                  <div className="stock-rating">
                    <span
                      className={`stock ${handicraft.stock < 20 ? "low" : ""}`}>
                      Stock: {handicraft.stock}
                    </span>
                    <div className="rating">
                      <Star size={14} className="star" />
                      <span>{handicraft.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="product-actions">
                  <button
                    onClick={() => openModal(handicraft)}
                    className="action-button edit">
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHandicraft(handicraft.id)}
                    className="action-button delete">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredHandicrafts?.length === 0 && (
          <div className="empty-state">
            <Package size={64} className="empty-icon" />
            <h3>No handicrafts found</h3>
            <p>Try adjusting your search or add a new handicraft</p>
          </div>
        )}
        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>
                  {editingHandicraft ? "Edit Handicraft" : "Add New Handicraft"}
                </h2>
                <button onClick={closeModal} className="close-button">
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Handicraft Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      className={`form-input ${errors.name ? "error" : ""}`}
                      placeholder="Enter handicraft name"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <span className="error-message">{errors.name}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="code" className="form-label">
                      Handicraft Code
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={values.code}
                      onChange={handleChange}
                      className={`form-input ${errors.code ? "error" : ""}`}
                      placeholder="Enter handicraft code"
                      disabled={isSubmitting}
                    />
                    {errors.code && (
                      <span className="error-message">{errors.code}</span>
                    )}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price" className="form-label">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      className={`form-input ${errors.price ? "error" : ""}`}
                      placeholder="0.00"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                    {errors.price && (
                      <span className="error-message">{errors.price}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock" className="form-label">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={values.stock}
                      onChange={handleChange}
                      className={`form-input ${errors.stock ? "error" : ""}`}
                      placeholder="0"
                      disabled={isSubmitting}
                    />
                    {errors.stock && (
                      <span className="error-message">{errors.stock}</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    className={`form-input ${errors.category ? "error" : ""}`}
                    disabled={isSubmitting}>
                    <option value="">Select category</option>
                    <option value="Wooden">Wooden goods</option>
                    <option value="Traditional">Traditional Art</option>
                    <option value="Handmade">Handmade craft</option>
                  </select>
                  {errors.category && (
                    <span className="error-message">{errors.category}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="image" className="form-label">
                    Product Image
                  </label>
                  <div className="image-upload-wrapper">
                    <label htmlFor="image" className="image-upload-label">
                      <Upload size={20} />
                      <span>
                        {imagePreview
                          ? "Change Image"
                          : "Click to upload or drag image"}
                      </span>
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="image-input-hidden"
                      disabled={isSubmitting}
                    />
                  </div>
                  {imagePreview && (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                      />
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Enter handicraft description"
                    rows="3"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={closeModal}
                  className="cancel-button"
                  disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  onClick={handleFormSubmit}
                  className={`submit-button ${isSubmitting ? "loading" : ""}`}
                  disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : editingHandicraft
                      ? "Update Handicraft"
                      : "Add Handicraft"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Handicraft;
