const userRouter = require("./user/userRoute.js");
const authRouter = require("./auth/authRouter.js");
const { productRouter } = require("./product/productRoute.js");

module.exports = {
  userRouter,
  authRouter,
  productRouter,
};
