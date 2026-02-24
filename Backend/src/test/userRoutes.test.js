const request = require("supertest");
const app = require("../index").default;
const express = require("express");

describe("User Routes", () => {
  let testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "TestPass123",
  };
  let token = "";

  it("should register a new user", async () => {
    const res = await request(app).post("/api/user/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should fetch user profile with token", async () => {
    const res = await request(app)
      .get("/api/user/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe(testUser.email);
  });
});
