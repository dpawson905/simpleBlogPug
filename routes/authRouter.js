const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const { asyncErrorHandler } = require("../middleware/index");

router
  .route("/register")
  .get(authController.getRegister)
  .post(asyncErrorHandler(authController.postRegister));

router
  .route("/login")
  .get(authController.getLogin)
  .post(asyncErrorHandler(authController.postLogin));

router
  .route("/resend-token")
  .get(authController.getResendToken)
  .post(asyncErrorHandler(authController.postResendToken));

router.get("/token", asyncErrorHandler(authController.verifyFromEmail));
router.get("/logout", authController.logOut);

module.exports = router;
