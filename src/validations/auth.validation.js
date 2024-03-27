const Joi = require("joi");
const { LANGUAGE } = require("../utils/constant.helper.js");
const { password } = require("./custom.validation.js");

// register
const register = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required().custom(password)
  }),
};


const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail
};
