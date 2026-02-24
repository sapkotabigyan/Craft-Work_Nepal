const { User } = require("../models/user/User");
const Sequelize = require("sequelize");
const express = require("express");
require("dotenv").config();

const dbMock = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    logging: false,
  }
);

const userMock = dbMock.define("User", {
  name: "test name",
  email: "test email",
  password: "test password",
});

describe("User Model", () => {
  it("should create an item", async () => {
    const user = await userMock.create({
      name: "new name",
      email: "new email",
      password: "new password",
    });
    expect(user.name).toBe("new name");
    expect(user.email).toBe("new email");
    expect(user.password).toBe("new password");
  });
});
