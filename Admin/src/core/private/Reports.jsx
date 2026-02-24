import React, { useState, useEffect } from "react";
import { getAllUsers } from "../../services/userApi";
import { getAllCategories } from "../../services/categoryApi";
import { getAllProducts } from "../../services/productApi";
import Sidebar from "../../components/Sidebar";
import "../../Styles/dashboard.css";

const Reports = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalProducts: 0,
    totalStock: 0,
    lowStockProducts: [],
    categoryDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const usersResponse = await getAllUsers();
      const categoriesResponse = await getAllCategories();
      const productsResponse = await getAllProducts();

      const usersData = Array.isArray(usersResponse) ? usersResponse : [];
      const categoriesData = Array.isArray(categoriesResponse) ? categoriesResponse : [];
      const productsData = productsResponse.data || [];

      const totalStock = productsData.reduce((sum, p) => sum + (p.stock || 0), 0);
      const lowStock = productsData.filter(p => (p.stock || 0) < 10);

      // Calculate category distribution
      const categoryCount = {};
      productsData.forEach(p => {
        const cat = p.category || "Uncategorized";
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });

      setStats({
        totalUsers: usersData.length,
        totalCategories: categoriesData.length,
        totalProducts: productsData.length,
        totalStock,
        lowStockProducts: lowStock,
        categoryDistribution: Object.entries(categoryCount).map(([name, count]) => ({ name, count })),
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load report data");
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h1 className="page-title">Reports & Analytics</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="report-cards">
          <div className="report-card">
            <div className="report-icon blue">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="report-content">
              <h3>Total Users</h3>
              <p className="report-number">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="report-card">
            <div className="report-icon purple">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="report-content">
              <h3>Categories</h3>
              <p className="report-number">{stats.totalCategories}</p>
            </div>
          </div>

          <div className="report-card">
            <div className="report-icon green">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div className="report-content">
              <h3>Total Products</h3>
              <p className="report-number">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="report-card">
            <div className="report-icon orange">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div className="report-content">
              <h3>Total Stock</h3>
              <p className="report-number">{stats.totalStock}</p>
            </div>
          </div>
        </div>

        <div className="report-sections">
          <div className="report-section">
            <h2>Category Distribution</h2>
            <div className="category-bars">
              {stats.categoryDistribution.map((cat, index) => (
                <div key={index} className="category-bar-item">
                  <div className="category-bar-label">
                    <span>{cat.name}</span>
                    <span>{cat.count} products</span>
                  </div>
                  <div className="category-bar-track">
                    <div 
                      className="category-bar-fill" 
                      style={{ 
                        width: `${(cat.count / stats.totalProducts) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="report-section">
            <h2>Low Stock Products (less than 10)</h2>
            {stats.lowStockProducts.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category || "Uncategorized"}</td>
                      <td className="low-stock">{product.stock}</td>
                      <td>${product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">All products are well stocked!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
