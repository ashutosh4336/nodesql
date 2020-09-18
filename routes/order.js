const exppress = require('express');
const router = exppress.Router();

const {
  craeteOrder,
  getAllPurchasedProductByUser,
  getProductByRankOfPurchase,
  getAllCustomerByProduct,
  getAllOrder,
  editOrder,
  deleteOrder,
} = require('../controllers/order');

router.route('/').post(craeteOrder).get(getProductByRankOfPurchase);
router.route('/:id').put(editOrder).delete(deleteOrder);
router.get('/all', getAllOrder);
router.route('/customer/:customer_id').get(getAllPurchasedProductByUser);
router.route('/product/:product_id').get(getAllCustomerByProduct);

module.exports = router;
