const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const {
  asyncErrorHandler,
  isAdmin,
  isNotAuthenticated,
} = require("../middleware/index");

router.get(
  "/",
  isNotAuthenticated,
  isAdmin,
  asyncErrorHandler(adminController.getAdminPage)
);

module.exports = router;
