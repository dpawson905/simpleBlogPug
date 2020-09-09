const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const blogController = require("../controllers/blogController");

const { asyncErrorHandler } = require("../middleware/index");

router.get("/", asyncErrorHandler(blogController.getBlogs));

router
  .route("/create")
  .get(blogController.getNewBlog)
  .post(upload.single("image"), asyncErrorHandler(blogController.postBlog));

module.exports = router;
