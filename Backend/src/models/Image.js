const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/index");
const express = require("express");
const Images = sequelize.define("images", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Images;
