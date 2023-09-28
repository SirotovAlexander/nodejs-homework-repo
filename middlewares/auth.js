const jwt = require("jsonwebtoken");

const UsersModel = require("../models/usersModel");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authorized",
      data: "Error",
    });
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await UsersModel.findById(id);
    if (!user || !user.token || user.token !== token) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authorized",
      data: "Error",
    });
  }
};

module.exports = authenticate;
