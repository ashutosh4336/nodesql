const exppress = require('express');
const router = exppress.Router();

const {
  getAllProductMethod,
  addProductMethod,
  getSingleProductMethod,
  updateSingleProductMethod,
  deleteSingleProductMethod,
} = require('../controllers/product');

// router.get('/shop', getAllProduct);

router.route('/').get(getAllProductMethod).post(addProductMethod);
router
  .route('/:id')
  .get(getSingleProductMethod)
  .put(updateSingleProductMethod)
  .delete(deleteSingleProductMethod);

module.exports = router;
