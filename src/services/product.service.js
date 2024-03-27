const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const { Product, Cart } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op } = require('sequelize');
const User = require("../models/user.model");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createProduct = async (userBody, req) => {
  const product = Product.create(userBody);
  return product;
};

const getSingleProduct = async (productId) => {
  const product = Product.findByPk(productId);
  return product;
};

const getSingleProductByQuery = async (query) => {
  const product = Product.findOne({where:query});
  return product;
};

const updateProduct = async (data, productId, req) => {
  const deleteProduct = Product.update(data,{
    where: {
      id:productId
    }
  });
  return deleteProduct;
};

const deleteProduct = async (query, productId) => {
  try {
    const deleteProduct = await Product.destroy({
      where: query
    });
    return deleteProduct;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
  }
};

const getMyProduct = async (userBody, req) => {

  const productList =  await Product.findAll({
    where:Object.keys(filter)?.length ? {...filter, isSold:false}:{isSold:false},
    include: [
      {
        model: User,
        attributes: ['id', 'username', 'email'],
        as: 'user',
      },
    ],
    order: [['createdAt', 'ASC']],
    attributes: ['id', 'name', 'price', 'description', 'image', 'user'],
    offset: (Number(options.page ?? 1) - 1) * Number(options.limit),
    limit: Number(options.limit),
  });
  return productList;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const getProductList = async (filter, options, includeArr, req) => {

  let includeOption = [
    {
      model: User,
      attributes: ['id', 'username', 'email'],
      as: 'user',
    }
  ]
  const productList =  await Product.findAll({
    where:Object.keys(filter)?.length ? filter:null,
    include: includeOption.length ? [
      ...includeOption,
    ]: includeOption,
    offset: (Number(options.page ?? 1) - 1) * Number(options.limit),
    limit: Number(options.limit),
  });
  return productList;
};
const getProductListCount = async (filter, options, req) => {

  const productList = await Product.count({
    where:Object.keys(filter)?.length ? filter:null
  });
  return productList;
};

module.exports = {
  createProduct,
  updateProduct,
  getProductListCount,
  getSingleProduct,
  getSingleProductByQuery,
  deleteProduct,
  getMyProduct,
  getProductList
};
