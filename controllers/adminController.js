const User = require("../models/userModel");

exports.getAdminPage = async (req, res, next) => {
  const users = await User.find();
  res.render("admin/index", { url: "acp", users });
};
