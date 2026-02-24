const express = require("express");
const {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductByCategory,
} = require("../../controller/product/productController");
const router = express.Router();
const multer = require("multer");

const storage = require("../../middleware/multerConfig");
const upload = multer({ storage });

router.get("/category/:name", getProductByCategory);
router.post("/upload", upload.single("image"), addProduct);
router.get("/", getAllProducts);
router.delete("/:id", deleteProduct);

module.exports = { productRouter: router };
