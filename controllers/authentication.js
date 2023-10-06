const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const gravatar = require("gravatar");

const fs = require("fs").promises;

const UsersModel = require("../models/usersModel");
const {
  registerUserValidationSchema,
  loginUserValidationSchema,
} = require("../utils/validation/usersValidationSchemas");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await UsersModel.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  const hashPassword = await bcryptjs.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await UsersModel.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { error } = loginUserValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "invalid data" });
  }
  const { email, password } = req.body;
  const user = await UsersModel.findOne({ email });
  if (!user) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Email or password is wrong",
      data: "Error",
    });
  }
  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Email or password is wrong",
      data: "Error",
    });
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await UsersModel.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  const user = await UsersModel.findByIdAndUpdate(_id, { token: "" });
  if (!user) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authorized",
      data: "Error",
    });
  }
  return res.status(204).json({ message: "Logout success" });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};

const changeAvatar = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
};

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  changeAvatar,
};
