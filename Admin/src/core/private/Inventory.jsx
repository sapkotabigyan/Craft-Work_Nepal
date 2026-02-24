import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  AlertTriangle,
  Package,
  TrendingDown,
  Plus,
} from "lucide-react";
import "../../Styles/Inventory.css";
import Sidebar from "../../components/Sidebar";
import { useEffect } from "react";
import { getAllProducts } from "../../services/productApi";

const InventorySection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  useEffect(() => {
    // Fetch inventory items from API or state management
    const fetchInventory = async () => {
      try {
        const response = await getAllProducts();

        setInventoryItems(response.data);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };
    fetchInventory();
  }, []);

  const filteredInventory = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("Inventory Items:", filteredInventory);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  const lowStockItems = inventoryItems.filter(
    (item) => item.currentStock <= item.minStock
  );
  const outOfStockItems = inventoryItems.filter(
    (item) => item.currentStock === 0
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="inventory-section">
        <div className="inventory-header">
          <h2 className="inventory-title">Inventory Management</h2>
          <button
            className="inventory-add-button"
            onClick={() => navigate("/addstock")}
          >
            <Plus size={18} />
            <span>Add Stock</span>
          </button>
        </div>

        {/* Inventory Stats */}
        <div className="stats-grid">
          <StatCard
            title="Total Items"
            value={inventoryItems.length}
            icon={<Package className="stat-icon stat-blue" />}
            bg="stat-blue"
          />
          <StatCard
            title="Low Stock"
            value={lowStockItems.length}
            icon={<TrendingDown className="stat-icon stat-yellow" />}
            bg="stat-yellow"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockItems.length}
            icon={<AlertTriangle className="stat-icon stat-red" />}
            bg="stat-red"
          />
          <StatCard
            title="Total Value"
            value="$45,280"
            icon={<Package className="stat-icon stat-green" />}
            bg="stat-green"
          />
        </div>

        {/* Search */}
        <div className="search-box">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search inventory by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Inventory Table */}
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th>Cost/Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-900">
                          {item.stock}
                        </span>
                        <span className="text-gray-500">/{50}</span>
                      </div>
                      <div className="stock-bar">
                        <div
                          className={`stock-bar-fill ${
                            item.stock === 0
                              ? "fill-red"
                              : item.stock <= 5
                              ? "fill-yellow"
                              : "fill-green"
                          }`}
                          style={{
                            width: `${getStockPercentage(item.stock, 50)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${item?.status
                        ?.toLowerCase()
                        ?.replace(/ /g, "-")}`}
                    >
                      {item.stock >= 10
                        ? "In Stock"
                        : item.stock <= 5
                        ? "Low Stock"
                        : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <div>${item.sellPrice}</div>
                    <div className="text-xs text-gray-500">
                      Cost: ${item.cost}
                    </div>
                  </td>
                  <td className="inventory-actions">
                    <button>Restock</button>
                    <button>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts */}
        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <div className="alert-box">
            <AlertTriangle className="stat-icon stat-yellow" />
            <div>
              <div className="alert-title">Inventory Alerts</div>
              <div className="alert-message">
                {outOfStockItems.length > 0 && (
                  <p>
                    <span className="font-medium">
                      {outOfStockItems.length}
                    </span>{" "}
                    items are out of stock
                  </p>
                )}
                {lowStockItems.length > 0 && (
                  <p>
                    <span className="font-medium">{lowStockItems.length}</span>{" "}
                    items are running low on stock
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bg }) => (
  <div className={`stat-card ${bg}`}>
    <div>
      <div className="stat-text">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
    <div>{icon}</div>
  </div>
);

export default InventorySection;
