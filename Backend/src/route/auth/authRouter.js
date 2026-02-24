const express = require("express");
const { authController } = require("../../controller/auth/authController.js");
const { userController } = require("../../controller/user/userController.js");
const { authenticateToken } = require("../../middleware/token-middleware");
const router = express.Router();

// Protected route - requires authentication
router.get("/init", authenticateToken, authController.init);

// Public routes - no authentication required
router.post("/login", authController.login);
router.post("/register", userController.create);

module.exports = { authRouter: router };
