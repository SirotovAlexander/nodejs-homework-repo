const express = require("express");

const ctrl = require("../../controllers/authentication");

const router = express.Router();

router.post("/register", ctrl.register);

module.exports = router;
