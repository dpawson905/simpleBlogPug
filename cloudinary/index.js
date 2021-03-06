const crypto = require("crypto");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  url: process.env.CLOUDINARY_URL,
});
const cloudinaryStorage = require("multer-storage-cloudinary");
const storage = cloudinaryStorage({
  cloudinary,
  folder: "NewBlog",
  allowedFormats: ["jpeg", "jpg", "png"],
  filename: function (req, file, cb) {
    let buf = crypto.randomBytes(16);
    buf = buf.toString("hex");
    let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/gi, "");
    uniqFileName += buf;
    cb(undefined, uniqFileName);
  },
});

module.exports = {
  cloudinary,
  storage,
};
