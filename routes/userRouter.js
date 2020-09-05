const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const userController = require("../controllers/userController");

const {
  asyncErrorHandler,
  isNotAuthenticated,
} = require("../middleware/index");

/* GET users listing. */
router
  .route("/:username")
  .get(isNotAuthenticated, asyncErrorHandler(userController.getProfile))
  .post(
    upload.single("image"),
    isNotAuthenticated,
    asyncErrorHandler(userController.updateProfile)
  );

module.exports = router;
