const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const {
  cartService,
  productService,
  // emailService,
} = require("../services/index.js");
const { User, Cart } = require("../models");
const ApiError = require("../utils/ApiError");

// user register
const addToCart = catchAsync(async (req, res, next) => {
  try {
    const { productId } = req.body

    const cart = await cartService.addToCart(productId, req.user?.id);
    res
      .status(201)
      .json({ sucess: true, message: 'Product added to cart successfully!', cart });
  } catch (error) {
    res.status(error.status ?? 500).json({ success:false, error: error.message?? 'Internal Server Error' });
  }
});

// user register
const removeFromCart = catchAsync(async (req, res, next) => {
  try {
    const { cartItemId } = req.params
    const cartExist = await cartService.getCartByPk(cartItemId);
    if (!cartExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "This product is not in your cart!")
    }
    const cart = await cartService.removeFromCart(cartItemId, req);
    res
      .status(200)
      .json({ sucess: true, message: 'Product successfully removed from cart!' });
  } catch (error) {
    res.status(error.status ?? 500).json({ success:false, error: error.message?? 'Internal Server Error' });
  }
});

// cart item list
const cartItemList = catchAsync(async (req, res, next) => {
  try {
    const { page, limit } = req.query
    const cartList = await cartService.cartItemList({userId:req.user.id}, {page, limit});
    const cartItemCount = await cartService.cartItemListCount({userId:req.user.id}, {page, limit});
    const totalPage = Math.ceil(cartItemCount/limit)
    res
      .status(201)
      .json({
        sucess: true,
        message: 'Product list get successfully!',
        data: {
          totalPage,
          totalResults: cartItemCount,
          results:cartList,
          page: page ?? 1,
          limit: limit ?? 10
        }
      });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(error.status ?? 500).json({ success:false, error: error.message?? 'Internal Server Error' });
  }
});

module.exports = {
  addToCart,
  removeFromCart,
  cartItemList
};
