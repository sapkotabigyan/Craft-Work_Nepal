const express = require("express");
jest.mock("../models/index", () => ({
  User: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));
const { userController } = require("../controller/user/userController.js");
const { User } = require("../models/index");

describe("User Controller", () => {
  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it("should fetch all users", async () => {
    const req = {};
    const res = mockRes();
    User.findAll.mockResolvedValue([{ name: "Test User" }]);
    await userController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      data: [{ name: "Test User" }],
      message: "successfully fetched data",
    });
  });

  it("should create a new user", async () => {
    const req = {
      body: {
        email: "test@email.com",
        fullName: "Test User",
        password: "pass",
      },
    };
    const res = mockRes();
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      name: "Test User",
      email: "test@email.com",
    });
    await userController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      data: { name: "Test User", email: "test@email.com" },
      message: "successfully created user",
    });
  });

  it("should update user", async () => {
    const req = {
      params: { id: 1 },
      body: { name: "Updated", email: "test@email.com", password: "pass" },
    };
    const res = mockRes();
    const saveMock = jest.fn();
    User.findOne.mockResolvedValue({
      name: "Old",
      email: "old@email.com",
      password: "oldpass",
      save: saveMock,
    });
    await userController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      data: expect.any(Object),
      message: "user updated successfully",
    });
    expect(saveMock).toHaveBeenCalled();
  });

  it("should delete user", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();
    const destroyMock = jest.fn();
    User.findOne.mockResolvedValue({ destroy: destroyMock });
    await userController.delelteById(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "user deleted successfully",
    });
    expect(destroyMock).toHaveBeenCalled();
  });

  it("should fetch user by id", async () => {
    const req = { params: { id: 1 } };
    const res = mockRes();
    User.findOne.mockResolvedValue({
      name: "Test User",
      email: "test@email.com",
    });
    await userController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "user fetched successfully",
      data: { name: "Test User", email: "test@email.com" },
    });
  });
});
