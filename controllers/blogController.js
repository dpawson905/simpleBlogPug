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

exports.getNewBlog = (req, res, next) => {
  res.render("blogs/new");
};

exports.postBlog = async (req, res, next) => {
  try {
    req.body.title = req.sanitize(req.body.title);
    let tags = req.body.tags;
    req.body.tags = tags.split(",").map((tag) => tag.trim());
    req.body.author = req.user.id;
    if (req.file) {
      const { secure_url, public_id } = req.file;
      req.body.image = {
        secure_url,
        public_id,
      };
    }
    if (!req.body.publishDate) req.body.publishDate = Date.now();
    if (req.body.private) req.body.private = true;
    req.body.content = entities.encode(req.body.content);
    req.body.slug = await slug(
      moment(Date.now()).format("DD-MM-YYYY") + "-" + req.body.title
    );
    if (req.body.featured) {
      const featureCheck = await Blog.findOne({ featured: true });
      if (featureCheck) {
        featureCheck.featured = false;
        await featureCheck.save();
      }
      req.body.featured = true;
    }
    console.log(req.body);
    await Blog.create(req.body);
    req.flash("success", "Blog created Successfully");
    res.redirect("/blogs");
  } catch (err) {
    console.log(err);
    await deleteProfileImage(req);
    req.flash("error", err.message);
    return res.redirect("/blogs");
  }
};
