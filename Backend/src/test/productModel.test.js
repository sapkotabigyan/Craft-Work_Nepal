const Sequelize = require("sequelize");
require("dotenv").config();
const express = require("express");

const dbMock = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    logging: false,
  }
);

const productMock = dbMock.define("product", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  product_description: {
    type: Sequelize.STRING,
  },
  product_code: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  product_price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  product_stock: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

beforeAll(async () => {
  await productMock.sync({ force: true });
});

describe("Product Model", () => {
  it("should create a product", async () => {
    const product = await productMock.create({
      product_name: "Product Name",
      product_description: "Product Description",
      product_code: "product code",
      product_price: 2,
      product_stock: 5,
    });
    expect(product.product_name).toBe("Product Name");
    expect(product.product_description).toBe("Product Description");
    expect(product.product_code).toBe("product code");
    expect(product.product_price).toBe("2");
    expect(product.product_stock).toBe(5);
  });

  it("should require a product name", async () => {
    try {
      await productMock.create({}); // Missing product_name
    } catch (err) {
      // Ensure the validation error message matches the required field validation
      expect(err.message).toMatch(
        /notNull Violation: product.product_name cannot be null/
      );
    }
  });
});
