const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const {
  asyncErrorHandler,
  isNotAuthenticated,
  isAuthenticated,
  isVerified,
} = require("../middleware/index");

/* GET users listing. */
router
  .route("/:username")
  .get(isNotAuthenticated, asyncErrorHandler(userController.getProfile));

module.exports = router;
