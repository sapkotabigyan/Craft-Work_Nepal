const express = require("express");
const { userController } = require("../../controller/user/userController.js");
const router = express.Router();
console.log("User route loaded", userController);

router.get("/", userController.getAll);
router.post("/", userController.create);
router.patch("/profile", userController.updateProfile);
router.post("/change-password", userController.changePassword);
router.patch("/:id", userController.update);
router.get("/:id", userController.getById);
router.delete("/:id", userController.delelteById);

module.exports = { userRouter: router };
