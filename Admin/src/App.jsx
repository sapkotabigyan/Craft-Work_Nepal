import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./core/public/Adminlogin";
import Dashboard from "./core/private/dashboard";
import Product from "./core/private/Product";
import Orders from "./core/private/Order";
import Inventory from "./core/private/Inventory";
import AddStock from "./components/AddStock";
import Users from "./core/private/Users";
import Categories from "./core/private/Categories";
import Reports from "./core/private/Reports";

function App() {
  return (
    <Routes>
      {<Route path="/dashboard" element={<Dashboard />} />}
      {<Route path="/product" element={<Product />} />}
      {<Route path="/Orders" element={<Orders />} />}
      {<Route path="/inventory" element={<Inventory />} />}
      {<Route path="/AddStock" element={<AddStock />} />}
      {<Route path="/users" element={<Users />} />}
      {<Route path="/categories" element={<Categories />} />}
      {<Route path="/reports" element={<Reports />} />}
      {<Route path="/login" element={<Login />} />}

      {<Route path="/" element={<Login />} />}
      {/* // <Route path="/categories/:name" element={<Categories />} /> } */}
    </Routes>
  );
}

export default App;
