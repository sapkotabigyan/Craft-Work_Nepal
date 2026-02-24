const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/index");
const express = require("express");
const product = sequelize.define(
  "products",
  {
    productId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Unknown Product",
    },
    product_description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    product_code: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    product_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    product_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories",
        key: "categoryId",
      },
    },
    imageId: {
      type: DataTypes.INTEGER,
      references: {
        model: "images",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  },
);

module.exports = product;
