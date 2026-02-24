const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/index");
const express = require("express");
const categories = sequelize.define(
  "categories",
  {
    categoryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = categories;
