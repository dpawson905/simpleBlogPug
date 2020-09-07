const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const moment = require("moment");
const slug = require("slugify");
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

const { cloudinary } = require("../cloudinary/");

const { deleteProfileImage } = require("../middleware");

const showdown = require("showdown");
const showdownHighlight = require("showdown-highlight");
const prettify = require("showdown-prettify");
const converter = new showdown.Converter({
  extensions: [showdownHighlight, "prettify"],
});

exports.getBlogs = async (req, res, next) => {
  const blogs = await Blog.find({
    author: {
      $eq: req.user._id,
    },
    publishDate: {
      $lte: Date.now(),
    },
  });
  res.render("blogs/allBlogs", { url: "all-blogs", blogs });
};

exports.getBlog = async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) return res.status(404).render("404");
  let decodedBlog = await converter(blog.content);
  blog.content = converter.makeHtml(decodeBlog);
  return res.render("blogs/view", {
    blog,
    subTitle: `- ${blog.title}`,
    url: "blog",
  });
};
