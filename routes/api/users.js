const express = require("express");

const authenticate = require("../../middlewares/auth");
const upload = require("../../middlewares/uploads");

const ctrl = require("../../controllers/authentication");

const router = express.Router();

router.post("/register", ctrl.register);

router.post("/login", ctrl.login);

router.post("/logout", authenticate, ctrl.logout);

router.get("/current", authenticate, ctrl.getCurrent);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.changeAvatar
);

module.exports = router;
