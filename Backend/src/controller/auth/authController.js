const { User } = require("../../models/index");
const { generateToken } = require("../../security/jwt-util");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const express = require("express");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kcp5714@gmail.com",
    pass: "tglhchrqalvdaqce",
  },
});
// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || user == null) {
    return res.status(400).json({ message: "User not found" });
  }
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  transporter.sendMail({
    from: "Finder Keeper",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
  await User.update({ otp }, { where: { email } });
  return res.status(200).json({ message: "Otp has been sent to your email" });
};

const saltRounds = 10;

const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  const user = await User.findOne({ where: { email } });
  console.log(user);

  if (!otp || otp == null) {
    return res.status(400).json({ message: "Please provide valid otp" });
  } else if (otp == user.otp) {
    return res.status(200).json({ message: "Otp has been verified" });
  } else {
    return res.status(400).json({ message: "Invalid Otp " });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    // bcryptjs provides synchronous helpers; use sync to avoid Promise incompatibilities
    const hash = bcrypt.hashSync(password, saltRounds);
    const [updated] = await User.update(
      { password: hash },
      { where: { email } },
    );

    if (updated) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    //fetching all the data from users table
    if (req.body.email == null) {
      return res.status(400).send({ message: "email is required" });
    }
    if (req.body.password == null) {
      return res.status(400).send({ message: "password is required" });
    }
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(400).send({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const token = generateToken({ user: user.toJSON() });
      return res.status(200).send({
        token,
        user: {
          id: user.id,
          firstName: user.name?.split(" ")[0] || "",
          lastName: user.name?.split(" ")[1] || "",
          email: user.email,
          name: user.name,
          role: user.role || "user",
        },
        message: "successfully logged in",
      });
    } else {
      return res.status(400).send({ message: "Invalid credentials" });
    }
  } catch (e) {
    console.log(e);
    if (e.name === "SequelizeConnectionRefusedError" || e.name === "SequelizeConnectionError" || e.parent?.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Database is unavailable. Please try again later." });
    }
    res.status(500).json({ error: "Failed to login" });
  }
};

/**
 *  init
 */

const init = async (req, res) => {
  try {
    const user = req.user.user;
    delete user.password;
    // Add role if not present
    user.role = user.role || "user";
    res
      .status(201)
      .send({ data: user, message: "successfully fetched current  user" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const authController = {
  login,
  init,
};

module.exports = {
  sendOtp,
  verifyOTP,
  resetPassword,
  authController,
};
