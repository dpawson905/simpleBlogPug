const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongo")(session);
const csrf = require("csurf");

const User = require("./models/userModel");

const authRouter = require("./routes/authRouter");
const indexRouter = require("./routes/indexRouter");
const usersRouter = require("./routes/userRouter");

const csrfProtection = csrf({ cookie: true });

const app = express();
app.use(compression());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Set security HTTP headers
const scriptSrcUrls = [
  "https://*.stripe.com",
  "https://js.stripe.com/",
  "https://*.bootstrapcdn.com",
  "https://kit.fontawesome.com/",
  "https://kit-pro.fontawesome.com/",
  "https://code.jquery.com/",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://*.bootstrapcdn.com",
  "https://*.cloudflare.com",
  "https://*.dribbble.com",
  "https://fonts.googleapis.com/",
  "https://kit.fontawesome.com/",
  "https://kit-pro.fontawesome.com/",
];
const connectSrcUrls = ["https://*.stripe.com/", "https://js.stripe.com/"];
const frameSrcUrls = ["https://*.stripe.com", "https://js.stripe.com/"];
const fontSrcUrls = [
  "https://fonts.gstatic.com/",
  "https://*.fontawesome.com/",
  "https://*.cloudflare.com",
  "https://*.dribbble.com",
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "http://127.0.0.1:3000/*"],
      frameSrc: ["'self'", ...frameSrcUrls],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/devsprout/",
        "https://images.unsplash.com/",
        "https://cdn.dribbble.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// Development logging
if (process.env.NODE_ENV.trim() === "development") {
  app.use(logger("common"));
}
app.use(methodOverride("_method"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

const sess = {
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60,
    maxAge: 1000 * 60 * 60,
  },
  store: new MongoDBStore({
    url: process.env.DB_URL,
    touchAfter: 24 * 3600,
    secret: process.env.COOKIE_SECRET,
  }),
  resave: true,
  saveUninitialized: false,
};

if (app.get("env") === "production") {
  app.set("trust proxy", true); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(flash());
app.use(session(sess));
app.use(csrfProtection);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.title = "SimpleBlog";
  // res.cookie('XSRF-TOKEN', csrfProtection);
  res.locals.csrfToken = req.csrfToken();
  res.locals.token = req.query.token;
  res.locals.currentUser = req.user;
  res.locals.isAuthenticated = req.user ? true : false;
  next();
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/", indexRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  debug(err);
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.render("error");
});

module.exports = app;
