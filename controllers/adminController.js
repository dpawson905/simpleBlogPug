const User = require("../models/userModel");
const Blog = require("../models/blogModel");

exports.getAdminPage = async (req, res, next) => {
  const users = await User.find();
  const blogs = await Blog.find();
  res.render("admin/index", { url: "acp", users, blogs });
};
