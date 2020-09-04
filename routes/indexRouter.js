const express = require("express");
const router = express.Router();

const index = require("../controllers/indexController");

const { asyncErrorHandler } = require("../middleware/index");

/* GET home page. */
router.get("/", asyncErrorHandler(index.indexPage));

router.all("*", (req, res, next) => {
  return res.render("404");
});

module.exports = router;
