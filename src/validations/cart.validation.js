const Joi = require("joi");
const { LANGUAGE } = require("../utils/constant.helper.js");
const { password } = require("./custom.validation.js");

// register
const addToCart = {
  body: Joi.object().keys({
    productId: Joi.number().required(),
  }),
};
const removeFromCart = {
  params: Joi.object().keys({
    cartItemId: Joi.number().required(),
  }),
};

const cartProductList = {
  body: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
  }),
};

module.exports = {
  addToCart,
  removeFromCart,
  cartProductList
};
