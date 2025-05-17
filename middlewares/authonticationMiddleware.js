const CustomAPIError = require("../errors");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/user");
const { StatusCodes } = require("http-status-codes");

const authonticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError.UnauthenticatedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userSchema.findById(payload.userID).select("-password");
    req.user = user;
    next();
  } catch (error) {
    throw new CustomAPIError.UnauthenticatedError("Unauthorized");
  }
};

module.exports = { authonticationMiddleware };
