const express = require("express");
jest.mock("../models/product.js", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
}));
jest.mock("../models/category.js", () => ({
  findOne: jest.fn(),
}));
jest.mock("../models/Image.js", () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
}));

const {
  getProductByCategory,
  addProduct,
  getAllProducts,
  deleteProduct,
} = require("../controller/product/productController.js");
const product = require("../models/product.js");
const categories = require("../models/category.js");
const Images = require("../models/Image.js");

describe("Product Controller", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should get all products", async () => {
    const req = {};
    const res = mockRes();
    product.findAll.mockResolvedValue([{ productId: 1, product_name: "Test" }]);
    await getAllProducts(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it("should add a product", async () => {
    const req = {
      body: {
        category: "TestCat",
        code: "TP001",
        description: "desc",
        name: "Test Product",
        price: 100,
        stock: 10,
      },
      file: { filename: "img.jpg", path: "/uploads/img.jpg" },
    };
    const res = mockRes();
    Images.create.mockResolvedValue({ id: 1, filename: "img.jpg" });
    categories.findOne.mockResolvedValue({ categoryId: 1 });
    product.create.mockResolvedValue({ productId: 1 });
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: expect.stringMatching(/added/i),
    });
  });

  it("should get products by category", async () => {
    const req = { params: { name: "TestCat" } };
    const res = mockRes();
    categories.findOne.mockResolvedValue({ dataValues: { categoryId: 1 } });
    product.findAll.mockResolvedValue([
      {
        productId: 1,
        product_name: "Test",
        image: { filename: "img.jpg" },
        product_stock: 10,
        product_price: 100,
        product_description: "desc",
      },
    ]);
    await getProductByCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it("should delete a product", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();
    product.findByPk.mockResolvedValue({ imageId: 1 });
    product.destroy.mockResolvedValue(1);
    Images.findByPk.mockResolvedValue({ id: 1 });
    Images.destroy.mockResolvedValue(1);
    await deleteProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: expect.stringMatching(/deleted/i),
    });
  });
});
