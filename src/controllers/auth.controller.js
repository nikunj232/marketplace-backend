const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const {
  authService,
  userService,
  tokenService,
  emailService,
  // emailService,
} = require("../services/index.js");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

// user register
const register = catchAsync(async (req, res) => {
  try {
    const user = await userService.createUser(req.body, req);
    // const tokens = await tokenService.generateAuthTokens(user);
    // const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    //   user
    // );
    // await emailService.sendVerificationEmail(user.email, verifyEmailToken);
    res
      .status(201)
      .json({ sucess: true, message: 'You are registered successfully!'});
  } catch (error) {
    res.status(error.status ?? 500).json({ success:false, message: error.message?? 'Internal Server Error' });
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.loginUserWithEmailAndPassword(
      email,
      password,
      req
    );
    const tokens = await tokenService.generateAuthTokens(user);
    res
      .status(200)
      .json({ sucess: true, message: 'You are logged in successgully!', user, tokens });
    } catch (error) {
    res
      .status(500)
      .json({ sucess: true, message: error.message ??'You are logged in successgully!' });
  }
});

const logout = catchAsync(async (req, res) => {
  try {
    const destroyedToken = await authService.logout(req.user.id);

    if (destroyedToken) {
      res.status(httpStatus.NO_CONTENT).send();
    }else{
      res.status(httpStatus.NO_CONTENT).json({message:"Session not found!"});
    }
  } catch (error) {
    res.status(httpStatus.NO_CONTENT).json({message:"Internal server error!"});
  }
});

// access-token profile
const accessToken = catchAsync(async (req, res) => {
  const data = await authService.accessToken(req.user);
  res.status(200).json({ success: true, message: "Profie get successfully!", data: data });
})


const sendVerificationEmail = catchAsync(async (req, res) => {
  try {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
      req.user
    );
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(200).send({message:"Verification mail sent on your mail"});
  } catch (error) {
    res.status(400).send({message:"Something went wrong!"});
  }
});

const verifyEmail = catchAsync(async (req, res) => {
  // await authService.verifyEmail(req.query.token);
  res.status(200).send({message: "Email verified successfully!"});
});

module.exports = {
  register,
  login,
  logout,
  accessToken,
  sendVerificationEmail,
  verifyEmail
};
