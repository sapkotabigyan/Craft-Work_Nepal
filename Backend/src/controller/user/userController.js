const { User } = require("../../models/index");
const { generateToken } = require("../../security/jwt-util");
const bcrypt = require("bcryptjs");
const express = require("express");

const SALT_ROUNDS = 10;

/**
 *  fetch all users
 */
const getAll = async (req, res) => {
  try {
    //fetching all the data from users table
    const users = await User.findAll();
    res.status(200).send({ data: users, message: "successfully fetched data" });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 *  create new users
 */

const create = async (req, res) => {
  try {
    const body = req.body;
    console.log(req.body);
    //validation
    const fullName = body.fullName || `${body.firstName} ${body.lastName}`;
    if (
      !body.email ||
      (!body.fullName && (!body.firstName || !body.lastName)) ||
      !body.password
    )
      return res.status(400).send({ message: "Invalid payload" });

    const existingUser = await User.findOne({ where: { email: body.email } });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

    const newUser = await User.create({
      name: fullName.trim(),
      email: body.email,
      password: hashedPassword,
    });

    // Generate token for the new user
    const token = generateToken({ user: newUser.toJSON() });

    // Return user and token
    return res.status(201).send({
      token,
      user: {
        id: newUser.id,
        firstName: body.firstName || newUser.name.split(" ")[0],
        lastName: body.lastName || newUser.name.split(" ")[1] || "",
        email: newUser.email,
        name: newUser.name,
      },
      message: "successfully created user",
    });
  } catch (e) {
    console.log(e);
    if (e.name === "SequelizeConnectionRefusedError" || e.name === "SequelizeConnectionError" || e.parent?.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Database is unavailable. Please try again later." });
    }
    return res.status(500).json({ message: "Failed to create user. Please try again." });
  }
};

/**
 *  update existing user
 */

const update = async (req, res) => {
  try {
    const { id = null } = req.params;
    const body = req.body;
    console.log(req.params);
    //checking if user exist or not
    const oldUser = await User.findOne({ where: { id } });
    if (!oldUser) {
      return res.status(500).send({ message: "User not found" });
    }
    oldUser.name = body.name;
    oldUser.password = body.password || oldUser.password;
    oldUser.email = body.email;
    oldUser.save();
    res
      .status(201)
      .send({ data: oldUser, message: "user updated successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to update users" });
  }
};

/**
 *  delete user
 */
const delelteById = async (req, res) => {
  try {
    const { id = null } = req.params;
    const oldUser = await User.findOne({ where: { id } });

    //checking if user exist or not
    if (!oldUser) {
      return res.status(500).send({ message: "User not found" });
    }
    oldUser.destroy();
    res.status(201).send({ message: "user deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 *  fetch user by id
 */
const getById = async (req, res) => {
  try {
    const { id = null } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(500).send({ message: "User not found" });
    }
    res.status(201).send({ message: "user fetched successfully", data: user });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 *  update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.user.id; // From authenticated token
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if email is taken by another user
    if (email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).send({ message: "Email already in use" });
      }
    }

    // Update user
    user.name = `${firstName} ${lastName}`.trim();
    user.email = email;
    await user.save();

    res.status(200).send({
      user: {
        id: user.id,
        firstName,
        lastName,
        email: user.email,
        name: user.name,
      },
      message: "Profile updated successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

/**
 *  change password
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.user.id; // From authenticated token
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Verify current password using bcrypt
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Current password is incorrect" });
    }

    // Hash new password before saving
    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    res.status(200).send({
      message: "Password changed successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to change password" });
  }
};

const userController = {
  getAll,
  create,
  getById,
  delelteById,
  update,
  updateProfile,
  changePassword,
};

module.exports = { userController };
