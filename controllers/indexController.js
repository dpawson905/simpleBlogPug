const Blog = require("../models/blogModel");

exports.indexPage = async (req, res, next) => {
  const blogs = await Blog.find();
  console.log(blogs);
  res.render("index", { url: "home", blogs });
};
