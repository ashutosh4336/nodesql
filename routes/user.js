const exppress = require('express');
const router = exppress.Router();

const {
  addUser,
  getAllUserMethod,
  getSingleUserMethod,
  updateSingleUserMethod,
  deleteSingleUserMethod,
  deleteAllUserMethod,
  bulkAddUser,
} = require('../controllers/user');

router
  .route('/')
  .get(getAllUserMethod)
  .post(addUser)
  .delete(deleteAllUserMethod);

router
  .route('/:id')
  .get(getSingleUserMethod)
  .put(updateSingleUserMethod)
  .delete(deleteSingleUserMethod);

router.route('/internal').post(bulkAddUser);

module.exports = router;
