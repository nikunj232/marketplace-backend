const express = require("express");
const validate = require("../../middlewares/validate.js");
const authValidation = require("../../validations/auth.validation.js");
const authController = require("../../controllers/auth.controller.js");
const { auth } = require("../../middlewares/auth.js");

const router = express.Router();

// register Api
router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);

// login Api
router.post("/login",
  validate(authValidation.login),
  authController.login
);

// router.post("/logout",
//   auth(),
//   authController.logout
// );

// access token Api
router.get(
  "/access-token",
  auth(),
  authController.accessToken
)


// router.post(
//   "/send-verification-email",
//   auth(),
//   authController.sendVerificationEmail
// );


// router.post(
//   "/verify-email",
//   validate(authValidation.verifyEmail),
//   authController.verifyEmail
// );

module.exports = router;
