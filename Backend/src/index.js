const express = require("express");
const bodyParser = require("body-parser");
const { db } = require("./database/index");
const { userRouter } = require("./route/user/userRoute.js");
const { authRouter } = require("./route/auth/authRouter.js");
const { categoryRouter } = require("./route/category/categoryRoute.js");
const dotenv = require("dotenv");
const { authenticateToken } = require("./middleware/token-middleware");
const router = require("./route/uploadRoutes");
const { createUploadsFolder } = require("./security/helper");
const cors = require("cors");
const { productRouter } = require("./route/product/productRoute");
const path = require("path");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5180",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      // Allow any localhost or 127.0.0.1 origin dynamically (development)
      if (origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Log the blocked origin for debugging
      console.warn("CORS blocked origin:", origin);
      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const port = process.env.PORT || 4000;
app.use(bodyParser.json());
// Public routes (no authentication required)
app.use("/api/auth", authRouter);
// Protected routes (authentication required)
app.use("/api/users", authenticateToken, userRouter);
// app.use("/api/file", router);
app.use("/api/product", productRouter);
app.use("/api/categories", categoryRouter);
createUploadsFolder();

// Global error handler - must be defined after all routes
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error. Please try again." });
});

app.listen(port, async function () {
  await db();
  console.log("project running in port", port);
});
module.exports = app;
