import React from "react";
import { useForm } from "react-hook-form";
import "../../Styles/Order.css";
import Sidebar from "../../components/Sidebar";

const ordersData = [
  {
    id: "ORD-001",
    method: "Credit Card",
    customer: "Sajba Shrestha",
    email: "sarah.j@email.com",
    product: "Handwoven Bamboo Basket",
    amount: 125,
    status: "Completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    method: "PayPal",
    customer: "Rijan Shavakoti",
    email: "mike.chen@email.com",
    product: "Ceramic Blue Vase",
    amount: 89,
    status: "Processing",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    method: "Credit Card",
    customer: "Kripan Sapkota",
    email: "emma.w@email.com",
    product: "Carved Wooden Elephant",
    amount: 245,
    status: "Shipped",
    date: "2024-01-13",
  },
  {
    id: "ORD-004",
    method: "Bank Transfer",
    customer: "Samir Aryal",
    email: "david.brown@email.com",
    product: "Silk Embroidered Scarf",
    amount: 65,
    status: "Pending",
    date: "2024-01-12",
  },
  {
    id: "ORD-005",
    method: "Credit Card",
    customer: "Sujan Rai",
    email: "lisa.garcia@email.com",
    product: "Hand-painted Jewelry Box",
    amount: 156,
    status: "Cancelled",
    date: "2024-01-11",
  },
];

const Orders = () => {
  const { register, watch } = useForm();
  const searchQuery = watch("search", "");
  const statusFilter = watch("status", "");

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      !statusFilter ||
      order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="orders-container">
        <h2>Orders</h2>

        <div
          className="search-export"
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
        >
          <input
            type="text"
            placeholder="Search orders, customers, or products..."
            {...register("search")}
            className="search-input"
          />
          <select
            {...register("status")}
            className="search-input"
            style={{ maxWidth: 180 }}
          >
            <option value="">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Shipped">Shipped</option>
          </select>
          <button className="export-btn">Export</button>
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index}>
                <td>
                  <strong>#{order.id}</strong>
                  <br />
                  <span className="method">{order.method}</span>
                </td>
                <td>
                  <strong>{order.customer}</strong>
                  <br />
                  <span className="email">{order.email}</span>
                </td>
                <td>{order.product}</td>
                <td>${order.amount}</td>
                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.date}</td>
                <td>
                  <span className="view-icon">👁️</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
