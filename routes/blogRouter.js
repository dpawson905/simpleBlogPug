const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");

const { asyncErrorHandler } = require("../middleware/index");

/* GET home page. */
router.get("/", asyncErrorHandler(blogController.getBlogs));

module.exports = router;
