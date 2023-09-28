const express = require("express");

const authenticate = require("../../middlewares/auth");

const ctrl = require("../../controllers/authentication");

const router = express.Router();

router.post("/register", ctrl.register);

router.post("/login", ctrl.login);

module.exports = router;
