const { cloudinary } = require("../cloudinary");
const { deleteProfileImage } = require("../middleware");
const util = require("util");
const User = require("../models/userModel");

exports.getProfile = async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });
  res.render("profile/index", { url: "profile", user });
};

exports.updateProfile = async (req, res, next) => {
  const { username, email } = req.body;
  const { currentUser } = res.locals;
  if (username) currentUser.username = username;
  if (email) currentUser.email = email;
  if (req.file) {
    if (currentUser.image.public_id) {
      // Changed user to currentUser
      await cloudinary.v2.uploader.destroy(currentUser.image.public_id);
    }
    const { secure_url, public_id } = req.file;
    currentUser.image = {
      secure_url,
      public_id,
    };
  }
  await currentUser.save();
  const login = util.promisify(req.login.bind(req));
  await login(currentUser);
  req.flash("success", "Profile updated.");
  res.redirect(`/users/${currentUser.username}`);
};
