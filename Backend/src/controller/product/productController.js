const Images = require("../../models/Image");
const categories = require("../../models/category");
const product = require("../../models/product");
const { Op } = require("sequelize");
const getProductByCategory = async (req, res) => {
  const category = req.params.name.toLowerCase();
  try {
    const categoryId = await categories.findOne({
      where: { category_name: category },
    });
    if (categoryId === null || categoryId.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the given categoryName" });
    }
    const products = await product.findAll({
      where: { categoryId: categoryId.dataValues.categoryId },
      include: [
        {
          model: Images,
          as: "image",
        },
      ],
    });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    const result = products.map((product) => {
      return {
        id: product.productId,
        name: product.product_name,
        imageUrl: product.image ? `/uploads/${product.image.filename}` : null,
        stock: product.product_stock,
        price: product.product_price,
        description: product.product_description,
      };
    });
    res.status(200).json(result);
  } catch (error) {
    if (error.name === "SequelizeConnectionRefusedError" || error.name === "SequelizeConnectionError" || error.parent?.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Database is unavailable. Please try again later." });
    }
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

const addProduct = async (req, res) => {
  const { category, code, description, name, price, stock } = req.body;
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    const { filename, path: filePath } = req.file;

    // Create image record
    const image = await Images.create({
      filename,
      path: filePath,
    });

    // Find category (case-insensitive)
    const categoryRecord = await categories.findOne({
      where: { category_name: { [Op.iLike]: category } },
    });

    if (!categoryRecord) {
      // If category not found, create it
      const newCategory = await categories.create({
        category_name: category.toLowerCase(),
      });
      var categoryId = newCategory.categoryId;
    } else {
      var categoryId = categoryRecord.categoryId;
    }

    // Create product record
    await product.create({
      product_code: code,
      product_description: description || "",
      product_name: name,
      product_price: price,
      product_stock: stock,
      categoryId,
      imageId: image.id,
    });

    return res.status(201).json({ message: "Product added successfully." });
  } catch (error) {
    console.log("Error in addProduct function", error);
    if (error.name === "SequelizeConnectionRefusedError" || error.name === "SequelizeConnectionError" || error.parent?.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Database is unavailable. Please try again later." });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const products = await product.findAll({
      include: [
        {
          model: Images,
          as: "image",
        },
        {
          model: categories,
          as: "categoryInfo",
          attributes: ["category_name"],
        },
      ],
    });

    const result = products.map((p) => {
      return {
        id: p.productId,
        name: p.product_name,
        code: p.product_code,
        imageUrl: p.image
          ? `http://localhost:4000/uploads/${p.image.filename}`
          : null,
        stock: p.product_stock,
        price: p.product_price,
        description: p.product_description,
        category: p.categoryInfo ? p.categoryInfo.category_name : null,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    if (error.name === "SequelizeConnectionRefusedError" || error.name === "SequelizeConnectionError" || error.parent?.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Database is unavailable. Please try again later." });
    }
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const productToDelete = await product.findByPk(productId);
    if (!productToDelete) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy({ where: { productId } });

    // Delete the image associated with the product
    if (productToDelete.imageId) {
      const image = await Images.findByPk(productToDelete.imageId);
      if (image) {
        await Images.destroy({ where: { id: image.id } });
      }
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error.name === "SequelizeConnectionRefusedError" || error.name === "SequelizeConnectionError" || error.parent?.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Database is unavailable. Please try again later." });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getProductByCategory,
  addProduct,
  getAllProducts,
  deleteProduct,
};
