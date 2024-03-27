const express = require("express");
const validate = require("../../middlewares/validate.js");
const {auth} = require("../../middlewares/auth.js");
const cartValidation = require("../../validations/cart.validation.js");
const cartController = require("../../controllers/cart.controller.js");
const { upload } = require("../../middlewares/upload.js");

const router = express.Router();

// add to cart
router.post(
  "/add-to-cart",
  auth(),
  validate(cartValidation.addToCart),
  cartController.addToCart
);

// add to cart
router.delete(
  "/remove-from-cart/:cartItemId",
  auth(),
  validate(cartValidation.removeFromCart),
  cartController.removeFromCart
);

// add to cart
router.get(
  "/get-cart-itemlist",
  auth(),
  validate(cartValidation.cartProductList),
  cartController.cartItemList
);

module.exports = router;
