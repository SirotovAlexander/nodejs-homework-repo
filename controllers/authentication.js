const bcryptjs = require("bcryptjs");
const { UsersModel } = require("../models/usersModel");
const {
  registerUserValidationSchema,
} = require("../utils/validation/usersValidationSchemas");

const register = async (req, res) => {
  const { name, email, password } = req.body;
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

  const newUser = await UsersModel.create({
    ...req.body,
    password: hashPassword,
  });

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

module.exports = {
  register,
};
