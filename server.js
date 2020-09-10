const debug = require("debug")("newblog:server");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  debug("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  debug(err.name, err.message);
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  // debug(process.env)
}
const app = require("./app");

const DB = process.env.DB_URL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => debug("DB connection successful!"));

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  debug(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  debug("UNHANDLED REJECTION! 💥 Shutting down...");
  debug(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
