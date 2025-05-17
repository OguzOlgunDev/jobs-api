const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
  },
  email: {
    type: String,
    required: [true, "Email must be provided"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid e mail",
    },
  },
  password: {
    type: String,
    required: [true, "Password must be provided"],
    minLength: 6,
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getName = function () {
  return this.name;
};

userSchema.methods.getEmail = function () {
  return this.email;
};

userSchema.methods.createJwt = function () {
  const token = jwt.sign(
    { userID: this._id, name: this.name, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
  return token;
};

userSchema.methods.comparePass = async function (candidatePass) {
  const isMatch = await bcrypt.compare(candidatePass, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
