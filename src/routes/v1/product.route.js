const express = require("express");
const validate = require("../../middlewares/validate.js");
const {auth, authenticateToken} = require("../../middlewares/auth.js");
const productValidation = require("../../validations/product.validation.js");
const productController = require("../../controllers/product.controller.js");
const { upload } = require("../../middlewares/upload.js");

const router = express.Router();

// register Api
router.post(
  "/create-product",
  auth(),
  upload.fields([
    { name: 'image', maxCount: 1 },
  ]),
  validate(productValidation.createProduct),
  productController.createProduct
);

router.get(
  "/get-single-product/:productId",
  productController.getSingleProduct
);

router.delete(
  "/delete-product/:productId",
  auth(),
  validate(productValidation.deleteProduct),
  productController.deleteProduct
);

router.put(
  "/update-product/:productId",
  auth(),
  upload.fields([
    { name: 'image', maxCount: 1 },
  ]),
  validate(productValidation.createProduct),
  productController.updateProduct
);

router.get(
  "/get-product-list",
  validate(productValidation.productList),
  productController.getProductListPaginate
);

router.get(
  "/get-my-product-list",
  auth(),
  validate(productValidation.myProductList),
  productController.getMyProduct
);


module.exports = router;
