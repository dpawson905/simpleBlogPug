const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");

const { asyncErrorHandler } = require("../middleware/index");

router.get("/", asyncErrorHandler(blogController.getBlogs));

router.route("/create").get(blogController.getNewBlog);

module.exports = router;
