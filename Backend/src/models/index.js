const { User } = require("./user/User");
const Images = require("./Image");
const categories = require("./category");
const Products = require("./product");

// Add image relation to products
Products.belongsTo(Images, { foreignKey: "imageId", as: "image" });
Images.hasMany(Products, { foreignKey: "imageId", as: "products" });

// Add category relation to products
Products.belongsTo(categories, { foreignKey: "categoryId", as: "categoryInfo" });
categories.hasMany(Products, { foreignKey: "categoryId" });

module.exports = {
  User,
  Images,
  categories,
  Products,
};
