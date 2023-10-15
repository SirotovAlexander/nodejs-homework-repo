const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const Jimp = require("jimp");

const fs = require("fs").promises;

const UsersModel = require("../models/usersModel");

const sendEmail = require("../helpers/sendEmail");

const {
  registerUserValidationSchema,
  loginUserValidationSchema,
} = require("../utils/validation/usersValidationSchemas");
const {
  verifyValidationEmailSchema,
} = require("../utils/validation/verifyValidationEmailSchema");
const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password, subscription } = req.body;
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
  const verificationToken = nanoid();
  const newUser = await UsersModel.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: "Verify email",
    html: `<a target='_blank' href='${BASE_URL}/api/users/users/verify/${verificationToken}'>Click to verify you email</a>`,
  };

  await sendEmail(mail);

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
  const { _id } = req.user;

  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  const img = await Jimp.read(tempUpload);
  await img
    .resize(250, 250) // resize
    .quality(60) // set JPEG quality
    .writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await UsersModel.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  changeAvatar,
};
