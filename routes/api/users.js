const express = require("express");

const ctrl = require("../../controllers/authentication");

const router = express.Router();

router.post("/users/register", ctrl.register);

module.exports = router;
