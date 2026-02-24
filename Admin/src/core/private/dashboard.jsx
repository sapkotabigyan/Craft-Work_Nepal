import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "../../Styles/dashboard.css";
import Sidebar from "../../components/Sidebar";

const Dashboard = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <header className="dashboard-header">
          <input type="text" placeholder="Search anything..." />
          <div
            className="profile-info"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#e5e7eb",
              }}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </span>
            <span>Admin</span>
            <button
              onClick={() => {
                // Simple logout: clear localStorage/session and reload or redirect
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/";
              }}
              style={{
                marginLeft: 8,
                background: "#f3f4f6",
                border: "none",
                borderRadius: 6,
                padding: "6px 14px",
                color: "#ef4444",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#fee2e2")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            >
              Logout
            </button>
          </div>
        </header>

        <section className="overview">
          <div className="card green">
            <p>Total Revenue</p>
            <h3>$352</h3>
            <span>+12.5%</span>
          </div>
          <div className="card blue">
            <p>Orders</p>
            <h3>123</h3>
            <span>+8.2%</span>
          </div>
          <div className="card purple">
            <p>Products</p>
            <h3>8</h3>
            <span>+1.1%</span>
          </div>
          <div className="card orange">
            <p>Customers</p>
            <h3>5</h3>
            <span>-1.0%</span>
          </div>
        </section>

        <section className="details">
          <div className="orders">
            <h4>Recent Orders</h4>
            <ul>
              <li>
                #ORD-001 - sajba shrestha - $12 -{" "}
                <span className="status completed">Completed</span>
              </li>
              <li>
                #ORD-002 - rijan shavakoti - $8 -{" "}
                <span className="status processing">Processing</span>
              </li>
              <li>
                #ORD-003 - Kripan Sapkota - $24 -{" "}
                <span className="status shipped">Shipped</span>
              </li>
              <li>
                #ORD-004 - Samir aryal - $6 -{" "}
                <span className="status pending">Pending</span>
              </li>
            </ul>
          </div>
          <div className="products">
            <h4>Top Products</h4>
            <ul>
              <li>Handmade craft - $15,840 (132 sold)</li>
              <li>Wooden goods - $12,250 (98 sold)</li>
              <li>Traditional Art - $10,875 (87 sold)</li>
            </ul>
          </div>
        </section>

        {/* <section className="form-section">
          <h4>Quick Add Product</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name")} placeholder="Product Name" />
            <input {...register("price")} placeholder="Price" type="number" />
            <input {...register("category")} placeholder="Category" />
            <button type="submit">Add Product</button>
          </form>
        </section> */}
      </main>
    </div>
  );
};

export default Dashboard;
