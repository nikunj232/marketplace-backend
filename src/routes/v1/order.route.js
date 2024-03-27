const express = require("express");
const validate = require("../../middlewares/validate.js");
const {auth} = require("../../middlewares/auth.js");
const authValidation = require("../../validations/auth.validation.js");
const productController = require("../../controllers/product.controller.js");
const { upload } = require("../../middlewares/upload.js");

const router = express.Router();

// register Api
router.post(
  "/create-order",
  upload.fields([
    { name: 'image', maxCount: 1 },
  ]),
  // validate(authValidation.register),
  productController.createProduct
);



module.exports = router;
