const CustomAPIError = require("../errors");
const user = require("../models/user");
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await userSchema.create({ name, email, password });

  const token = user.createJwt();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomAPIError.BadRequestError(
      "Please provide an email and password"
    );
  }

  const user = await userSchema.findOne({ email });

  if (!user) {
    throw new CustomAPIError.UnauthenticatedError("Invalid credantials");
  }

  const isPassCorrect = await user.comparePass(password);

  if (!isPassCorrect) {
    throw new CustomAPIError.UnauthorizedError("Invalid password");
  }

  const token = user.createJwt();

  res
    .status(StatusCodes.ACCEPTED)
    .json({ user: { name: user.getName() }, token });
};

module.exports = { login, register };
