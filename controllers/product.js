const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc        Get all Listed Product
// @route       GET api/v1/products
// @access      Private (Loggedin User)

exports.getAllProductMethod = asyncHandler(async (req, res, next) => {
  const allProduct = await Product.findAll();
  res
    .status(200)
    .json({ code: 200, count: allProduct.length, data: allProduct });
});

// @desc        Get Single Product
// @route       GET api/v1/products/:id
// @access      Public

exports.getSingleProductMethod = asyncHandler(async (req, res, next) => {
  const idOfProduct = /[a-z]/gi.test(req.params.id) ? false : true;

  if (!idOfProduct)
    return next(new ErrorResponse(`Product Doesn't Exist`, 404));

  const data = await Product.findByPk(req.params.id);
  // console.log(data);

  if (!data) return next(new ErrorResponse(`Product Doesn't Exist`, 404));

  return res.status(200).json({ data: data });
});

// @desc        Add Product
// @route       POST api/v1/products
// @access      Private (Admin)

exports.addProductMethod = asyncHandler(async (req, res, next) => {
  const toBeAddedProduct = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    image_url: req.body.image_url,
    // to know which user created the product
    // if user were to logged in we could add req.user.id
    userId: req.body.userId,
  };
  if (
    !toBeAddedProduct.title ||
    !toBeAddedProduct.price ||
    !toBeAddedProduct.description
  )
    return next(new ErrorResponse(`Provide the Required Fields`, 400));

  const product = await Product.create({
    title: toBeAddedProduct.title,
    price: toBeAddedProduct.price,
    description: toBeAddedProduct.description,
    image_url: toBeAddedProduct.image_url,
    userId: toBeAddedProduct.userId,
  });
  res.status(201).json({ code: 201, product });
});

// @desc        Update Product
// @route       PUT api/v1/products/:id
// @access      Private (Admin)

exports.updateSingleProductMethod = asyncHandler(async (req, res, next) => {
  const idOfProduct = /[a-z]/gi.test(req.params.id) ? false : true;

  if (!idOfProduct)
    return next(new ErrorResponse(`Product Doesn't Exist`, 400));

  const newProduct = {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    image_url: req.body.image_url,
  };

  const existingProduct = await Product.findByPk(req.params.id);

  if (!existingProduct)
    return next(new ErrorResponse(`Product Doesn't Exist`, 404));

  await Product.update(newProduct, {
    where: { id: req.params.id },
  });

  return res.status(200).json({ msg: 'Your Product has been Updated' });
});

// @desc        Delete Product
// @route       Delete api/v1/products/:id
// @access      Private (Admin)

exports.deleteSingleProductMethod = asyncHandler(async (req, res, next) => {
  const idOfProduct = /[a-z]/gi.test(req.params.id) ? false : true;

  if (!idOfProduct)
    return next(new ErrorResponse(`Product Doesn't Exist`, 400));

  const data = await Product.findOne({ where: { id: req.params.id } });

  if (!data) {
    return next(new ErrorResponse(`Product doesn't exist`, 404));
  }

  // console.log(data);
  await Product.destroy({ where: { id: data.id } });

  return res.status(200).json({ msg: 'Your Product has been Deleted' });
});
