const Blog = require("../models/blogModel");

exports.indexPage = async (req, res, next) => {
  const blogs = await Blog.find({
    author: {
      $eq: req.user._id,
    },
    publishDate: {
      $lte: Date.now(),
    },
  })
    .sort({ featured: -1 })
    .limit(5);
  res.render("index", { url: "home", blogs });
};
