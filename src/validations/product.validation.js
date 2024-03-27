const Joi = require("joi");
const { LANGUAGE } = require("../utils/constant.helper.js");
const { password } = require("./custom.validation.js");

// register
const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required()
  }),
};

// delete product
const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.number().required()
  }),
};

// register
const productList = {
  body: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    search: Joi.string(),
    userId: Joi.string(),
  }),
};
const myProductList = {
  body: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    search: Joi.string()
  }),
};

module.exports = {
  createProduct,
  productList,
  myProductList,
  deleteProduct
};
