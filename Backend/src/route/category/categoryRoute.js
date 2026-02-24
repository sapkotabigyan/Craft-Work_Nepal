const express = require("express");
const categories = require("../../models/category");
const { authenticateToken } = require("../../middleware/token-middleware");
const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const allCategories = await categories.findAll();
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
});

// Get category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await categories.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error: error.message });
  }
});

// Create new category
router.post("/", async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const newCategory = await categories.create({ category_name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
});

// Update category
router.patch("/:id", async (req, res) => {
  try {
    const category = await categories.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const { category_name } = req.body;
    if (category_name) {
      category.category_name = category_name;
      await category.save();
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    const category = await categories.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
});

module.exports = { categoryRouter: router };
