const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc        Create Order
// @route       POST api/v1/orders
// @access      Public

exports.craeteOrder = asyncHandler(async (req, res, next) => {
  const order = {
    // Both should be filled automatically
    // But here there is no Authentication
    // So we can't access the user Id
    // SHOULD BE == userId: req.user.id
    userId: req.body.userId,
    productId: req.body.productId,
  };
  if (!order.userId || !order.productId)
    return next(new ErrorResponse(`User Must Login to Place Order`, 400));

  await Order.create(order);

  const item = await Product.findByPk(order.productId);
  let purchaseCount = item.purchase_count;
  purchaseCount = purchaseCount + 1;

  // console.log(purchaseCount);
  await Product.update(
    { purchase_count: purchaseCount },
    { where: { id: order.productId } }
  );

  return res.status(201).json({
    code: 201,
    msg: 'Order Placed Successfully',
    productDeatils: item,
  });
});

// @desc        GET all Order
// @route       GET api/v1/orders/all
// @access      Private
exports.getAllOrder = asyncHandler(async (req, res, next) => {
  const orders = await Order.findAll();

  res.status(200).json({ code: 200, count: orders.length, data: orders });
});

// @desc        EDIT Order
// @route       PUT api/v1/orders/all
// @access      Private
exports.editOrder = asyncHandler(async (req, res, next) => {
  const idOforder = /[a-z]/gi.test(req.params.id) ? false : true;

  if (!idOforder) {
    return res.status(400).json({ msg: "Order Doesn't Exist" });
  }

  const newOrder = {
    cancelled: req.body.cancelled,
  };

  const order = await Order.findByPk(req.params.id);

  if (!order) {
    return res.status(400).json({ msg: "Order Doesn't Exist" });
  }

  await Order.update(newOrder, { where: { id: req.params.id } });

  res.status(200).json({ code: 200, msg: 'Order has been Updated' });
});

// @desc        Delete Order
// @route       Delete api/v1/orders/all
// @access      Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const idOforder = /[a-z]/gi.test(req.params.id) ? false : true;

  if (!idOforder) {
    return res.status(400).json({ msg: "Order Doesn't Exist" });
  }

  const order = await Order.findByPk(req.params.id);

  if (!order) {
    return res.status(400).json({ msg: "Order Doesn't Exist" });
  }

  await Order.destroy({ where: { id: req.params.id } });

  res.status(200).json({ code: 200, msg: 'Order has been Deleted' });
});

// Specific API

// @desc        Get all Products Purchasedby a Customer (Question No - 4.2)
// @route       Get api/v1/orders/customer/:customer_id
// @access      Private

exports.getAllPurchasedProductByUser = asyncHandler(async (req, res, next) => {
  const idOfUser = /[a-z]/gi.test(req.params.customer_id) ? false : true;

  if (!idOfUser) {
    return res.status(400).json({ msg: "User Doesn't Exist" });
  }

  const allOrders = await Order.findAll({
    where: { userId: req.params.customer_id },
  });

  //   console.log(allOrders);

  var allPurchasedProducts = [];

  for (let i of allOrders) {
    const singleProduct = await Product.findByPk(i.productId);
    allPurchasedProducts.push(singleProduct);
  }

  //   console.log(allPurchasedProducts);
  //   const purchasesItem = await Product.findByPk(req.body.productId);

  return res.status(201).json({
    code: 200,
    msg: "You've Purchased",
    count: allPurchasedProducts.length,
    allItems: allPurchasedProducts,
  });
});

// @desc        Get List of Products purchased most (Question No - 4.3)
// @route       Get api/v1/orders
// @access      Private

exports.getProductByRankOfPurchase = asyncHandler(async (req, res, next) => {
  let allProduct = await Product.findAll();

  allProduct = allProduct.map((a) => {
    if (a.purchase_count > 0) return a;
  });

  allProduct = allProduct.sort((a, b) => {
    return b.purchase_count - a.purchase_count;
  });

  // console.log(allProduct);
  //   const purchasesItem = await Product.findByPk(req.body.productId);

  return res.status(201).json({
    code: 200,
    msg: 'Most Purchased Products are',
    allItems: allProduct,
  });
});

// @desc        Get all Customer Who Purchased Specific Item (Question No - 4.1)
// @route       Get api/v1/orders/product/:product_id
// @access      Private

exports.getAllCustomerByProduct = asyncHandler(async (req, res, next) => {
  const idOfUser = /[a-z]/gi.test(req.params.product_id) ? false : true;

  if (!idOfUser) {
    return res.status(400).json({ msg: "Product Doesn't Exist" });
  }

  const allOrders = await Order.findAll({
    where: { productId: req.params.product_id },
  });

  //   console.log(allOrders);

  var allPurchasedUser = [];

  for (let i of allOrders) {
    const singleUser = await User.findByPk(i.userId);
    allPurchasedUser.push(singleUser);
  }

  //   console.log(allPurchasedUser);
  //   const purchasesItem = await Product.findByPk(req.body.productId);

  return res.status(201).json({
    code: 200,
    msg: "You've Purchased",
    allItems: allPurchasedUser,
  });
});
