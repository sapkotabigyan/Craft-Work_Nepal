import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { uploadProduct } from "../services/productApi";
import "../Styles/AddStock.css";

const AddStock = ({ onAdded }) => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    price: "",
    category: "Wooden Goods",
    stock: "",
    description: "",
    image: null,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });
      const res = await uploadProduct(fd);
      if (res.status === 201) {
        setStatus("Stock added successfully!");
        setForm({
          name: "",
          code: "",
          price: "",
          category: "",
          stock: "",
          description: "",
          image: null,
        });
        if (onAdded) onAdded();
      } else {
        setStatus("Failed to add stock.");
      }
    } catch (err) {
      setStatus("Error adding stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addstock-container">
      <form className="addstock-form" onSubmit={handleSubmit}>
        <h3>
          <PlusCircle size={20} /> Add Stock
        </h3>
        <input
          type="text"
          name="name"
          placeholder="Handicraft Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="code"
          placeholder="Handicraft Code"
          value={form.code}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="Wooden Goods">Wooden Goods</option>
          <option value="Handmade Craft">Handmade Craft</option>
          <option value="Traditional Art">Traditional Art</option>
        </select>
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={2}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Stock"}
        </button>
        <button
          type="button"
          className="back-button"
          style={{
            marginTop: 8,
            background: "#f3f4f6",
            color: "#6366f1",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        {status && <div className="status-message">{status}</div>}
      </form>
    </div>
  );
};

export default AddStock;
