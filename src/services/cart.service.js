const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const tokenService = require("./token.service");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const { User, Cart, Product } = require("../models/index.js");
const { productService } = require(".");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const addToCart = async (productId, userId, req) => {
  // Find the user and product records
  const user = await User.findByPk(userId);
  const productExist = await Product.findByPk(productId);

  if (!user || !productExist) {
    throw new Error(httpStatus.BAD_REQUEST, 'User or product not found.');
  }

  const cartItem = Cart.create({productId, userId})

  // await product.save()
  return cartItem
};

const getCartByPk = async (cartId) => {
  const cartItem = await Cart.findByPk(cartId)
  return cartItem
};

const removeFromCart = async (cartId, req) => {
  const cartExist = await Cart.findAll({
    where:{
      id:cartId
    }
  })
  if (!cartExist || (cartExist && cartExist[0].dataValues.userId !== req.user.id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product is not Found!')
  }
  await Cart.destroy({where:{
    id:cartId
  }})
  return ;
};

const removeMultipleItemFromCart = async (productId) => {
  const deleteCartItem =  Cart.destroy({
    where:{
      productId:productId
    }})

  return deleteCartItem;
};

const getOneCartItemByQuery = async (query, req) => {

  const cartItemList = await Cart.findAll({
    where:query
  })
  return cartItemList;
};

const getAllCartItemByQuery = async (query, req) => {

  const cartItemList = await Cart.findAll({
    where:query
  })
  return cartItemList;
};

const cartItemList = async (filter, options, req) => {

  const cartItemList = await Cart.findAll({
    where:Object.keys(filter)?.length ? {...filter}:null,
    include: [
      {
        model: User,
        attributes: ['id', 'username', 'email'],
        as: 'user',
      },
      {
        model: Product,
        as: 'product',
        include:[
          {
            model:User,
            attributes:['id', 'username', 'email'],
          }
        ],
      },
    ],
    offset: (Number(options?.page ?? 1) - 1) * Number(options?.limit),
    limit: Number(options?.limit),
  })
  return cartItemList;
};

const cartItemListCount = async (filter, options, req) => {
  const cartItemListCount = await Cart.count({
    where:Object.keys(filter)?.length ? {...filter}:null,
    include: [
      {
        model: User,
        attributes: ['id', 'username', 'email'],
        as: 'user',
      },
      {
        model: Product,
        as: 'product',
      },
    ],
    offset: (Number(options?.page ?? 1) - 1) * Number(options?.limit),
    limit: Number(options?.limit),
  })
  return cartItemListCount;
};

module.exports = {
  addToCart,
  removeFromCart,
  cartItemList,
  cartItemListCount,
  removeMultipleItemFromCart,
  getAllCartItemByQuery,
  getOneCartItemByQuery,
  getCartByPk
};