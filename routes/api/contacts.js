const express = require("express");
const authenticate = require("../../middlewares/auth");

const ctrl = require("../../controllers/contactControllers");

const router = express.Router();

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", authenticate, ctrl.getByID);

router.post("/", authenticate, ctrl.addContact);

router.delete("/:contactId", authenticate, ctrl.deleteContact);

router.put("/:contactId", authenticate, ctrl.updateContact);

router.patch("/:contactId/favorite", authenticate, ctrl.updateStatusContact);

module.exports = router;
