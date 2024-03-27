const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const {
  authService,
  userService,
  tokenService,
  productService,
  cartService,
  // emailService,
} = require("../services/index.js");
const { User, Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const pick = require("../utils/pick");
const { Op, Sequelize } = require("sequelize");
const { number } = require("joi");
const sequelize = require("../config/database");

// product register
const createProduct = catchAsync(async (req, res) => {
  try {
    const userId = req.user?.id
    const { image } = req.files

    if (!image) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Product Image is required")
    }
    const product = await productService.createProduct({ ...req.body, userId, image: image?.length ? image[0].filename : '' }, req)
    res
      .status(201)
      .json({ sucess: true, message: 'Product added successfully!', data: product });
  } catch (error) {
    console.error('Error during product creation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// product register
const getSingleProduct = catchAsync(async (req, res) => {
  try {
    const product = await productService.getSingleProduct(req.params.productId, req)

    res.status(200).json({ sucess: true, message: 'Product get successfully!', data: product });
  } catch (error) {
    res.status(500).json({ sucess: false, error: 'Internal Server Error' });
  }
});

// product delete
const deleteProduct = catchAsync(async (req, res, next) => {
  const userId = req.user?.id
  const productExist = await productService.getSingleProductByQuery({ id: Number(req.params.productId), userId: userId })

  if (!productExist || !productExist?.id) {
    new ApiError(httpStatus[400], 'Product not found!')
  }

  if (productExist?.id) {
    const deleteManyCartItem = await cartService.removeMultipleItemFromCart(productExist.id)
  }
  try {
    const deleteProduct = await productService.deleteProduct({ id: productExist.id, userId }, productExist.id)
    res
      .status(200)
      .json({ sucess: true, message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(error.status ?? 500).json({ sucess: false, error: error.message ?? 'Internal Server Error' });
  }
});

// product update
const updateProduct = catchAsync(async (req, res) => {
  const productExist = await productService.getSingleProduct(req.params.productId, req)
  if (!productExist) {
    next(new ApiError(httpStatus.BAD_REQUEST, 'Product not found!'))
  }

  const { image } = req.files

  try {
    const updatedProductData = productService.updateProduct(image?.length ? { ...req.body, image: image[0].filename } : req.body, req.params.productId, req)
    res
      .status(200)
      .json({ sucess: true, message: 'Product updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// product register
const getMyProduct = catchAsync(async (req, res) => {
  const { search } = await pick(req.query, ['search'])
  let { page, limit } = await pick(req.query, ['limit', 'page']);
  let filter = {}
  let includeArrField = [
    {
      model: User,
      attributes: ['id', 'username', 'email'],
      as: 'user',
    }
  ]
  let userId = req.user?.id ?? null
  if (!!userId) {
    filter = {
      ...filter,
      userId
    }
  }

  try {
    const productList = await productService.getProductList(filter, { page, limit }, includeArrField, req)
    const productListCount = await productService.getProductListCount(filter, { page, limit }, req)
    const totalPages = Math.ceil(productListCount / limit)

    res
      .status(200)
      .json({
        sucess: true, message: 'Product get Successfully!',
        data: {
          totalResult: productListCount,
          totalPages,
          results: productList,
          page: Number(page) ?? 1,
          limit: Number(limit) ?? 10
        }
      });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// product register
const getProductListPaginate = catchAsync(async (req, res) => {
  try {
    const search = req.query?.search
    let { page, limit } = await pick(req.query, ['limit', 'page']);
    let filter = {}

    const query = {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ],
      where: {
        [Op.or]: [
          {
            '$user.username$': { [Op.like]: `%${search ?? ''}%` }
          },
          {
            name: { [Op.like]: `%${search ?? ''}%` }
          }
        ]
      },
      offset: (Number(page ?? 1) - 1) * Number(limit),
      limit: Number(limit),
    }
    const productList = await Product.findAll(query)
    const productListCount = await Product.count({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ],
      where: {
        [Op.or]: [
          {
            '$user.username$': { [Op.like]: `%${search}%` }
          },
          {
            name: { [Op.like]: `%${search}%` }
          }
        ]
      },
      offset: (Number(page ?? 1) - 1) * Number(limit),
      limit: Number(limit),
    })
    const totalPage = Math.ceil(productListCount / limit)

    let productIdsInCart = []

    const productsWithCartItems = productList.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        user: product.user,
        isAddedToCart: productIdsInCart.includes(product.id), // Check if the product ID exists in the cart items
      };
    });
    res
      .status(200)
      .json({
        sucess: true,
        message: 'product list get successfully!',
        data: {
          totalResults: productListCount,
          totalPage,
          results: productsWithCartItems,
          page: Number(page) ?? 1,
          limit: Number(limit) ?? 10
        }
      }
      );
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = {
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getMyProduct,
  getProductListPaginate
};
