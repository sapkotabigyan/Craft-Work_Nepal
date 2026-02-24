const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  // Skip token verification for the login route
  if (
    req.path === "/api/auth/login" ||
    req.path === "/api/users" ||
    req.path === "/api/product/category/wooden" ||
    req.path === "/api/product/category/handmade" ||
    req.path === "/api/product/category/traditional" ||
    req.path.startsWith("/uploads/") ||
    req.path.startsWith("/api/product")
  ) {
    return next();
  }

  // Get token from Authorization header
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.secretkey, (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid or expired token.");
    }
    req.user = decoded; // Attach decoded payload to request object
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = { authenticateToken };
