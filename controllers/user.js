const User = require('../models/User');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// @desc        Bulk Add
// @route       POST api/v1/customers/internal
// @access      Private
exports.bulkAddUser = asyncHandler(async (req, res, next) => {
  let bulkData = req.body;

  // Hash Password
  for (let i of bulkData) {
    const salt = await bcrypt.genSalt(10);
    i.password = await bcrypt.hash(i.password, salt);
  }

  await User.bulkCreate(bulkData, { validate: true });
  /*
  for (let i of req.body) {
    const { name, username, email, password } = i;
    const cleanName = DOMPurify.sanitize(name);
    const cleanUserName = DOMPurify.sanitize(username);
    const cleanEmail = DOMPurify.sanitize(email);
    const cleanPassword = DOMPurify.sanitize(password);

    if (cleanPassword !== password)
      return next(new ErrorResponse(`Password isn't Valid`, 400));

    const user = {
      name: cleanName,
      username: cleanUserName,
      email: cleanEmail,
      password: cleanPassword,
    };

    if (!user.name || !user.email || !user.password || !user.username)
      return next(new ErrorResponse(`Provide the Required Fields`, 400));

    if (user.password.length < 6)
      return next(
        new ErrorResponse(`Password Must be at least 6 Characters Long`, 400)
      );

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await User.create(user);
  }
*/
  return res.status(201).json({
    code: 201,
    msg: 'All User Registered',
  });
});

// @desc        Add User
// @route       POST api/v1/customers
// @access      Public

exports.addUser = asyncHandler(async (req, res, next) => {
  const { name, username, email, password } = req.body;

  const cleanName = DOMPurify.sanitize(name);
  const cleanUserName = DOMPurify.sanitize(username);
  const cleanEmail = DOMPurify.sanitize(email);
  const cleanPassword = DOMPurify.sanitize(password);

  const user = {
    name: cleanName,
    username: cleanUserName,
    email: cleanEmail,
    password: cleanPassword,
  };
  if (!user.name || !user.email || !user.password || !user.username)
    return next(new ErrorResponse(`Provide the Required Fields`, 400));

  if (user.password.length < 6)
    return next(
      new ErrorResponse(`Password Must be at least 6 Characters Long`, 400)
    );

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const createdUser = await User.create(user);

  return res.status(201).json({
    code: 201,
    msg: 'User Registered',
    name: createdUser.name,
    email: createdUser.email,
  });
});

// @desc        Get all Registered User
// @route       GET api/v1/shop
// @access      Private (Loggedin User)

exports.getAllUserMethod = asyncHandler(async (req, res, next) => {
  const allUser = await User.scope('withoutPassword').findAll();
  res.status(200).json({ code: 200, count: allUser.length, data: allUser });
});

// @desc        Get Single User
// @route       GET api/v1/shop/:id
// @access      Public

exports.getSingleUserMethod = asyncHandler(async (req, res, next) => {
  const idOfUser = /[a-z]/gi.test(req.params.id) ? false : true;

  if (!idOfUser) {
    return res.status(400).json({ msg: "User Doesn't Exist" });
  }
  const data = await User.scope('withoutPassword').findByPk(req.params.id);
  if (!data) {
    return res.status(404).json({ msg: "User Doesn't Exist" });
  }
  return res.status(200).json({ data: data });
});

// @desc        Update User
// @route       PUT api/v1/user/:id
// @access      Private (User)

exports.updateSingleUserMethod = asyncHandler(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
  };

  const existingUser = await User.findByPk(req.params.id);
  // console.log(newUser, existingUser);

  if (!existingUser) {
    return res.status(404).json({ msg: "User Doesn't Exist" });
  }

  const emailCheck = await User.findOne({ where: { email: newUser.email } });
  // console.log('--->', emailCheck);
  if (emailCheck && emailCheck.email !== existingUser.email) {
    return res.status(400).json({ msg: 'Email address already in use!' });
  }
  const userNameCheck = await User.findOne({
    where: { username: newUser.username },
  });

  if (userNameCheck && userNameCheck.username !== existingUser.username) {
    return res.status(400).json({ msg: 'Username already in use!' });
  }

  // console.log('exsiting user ==>', existingUser);

  await User.update(newUser, {
    where: { id: existingUser.id },
  });

  return res.status(200).json({ msg: 'Your User has been Updated' });
});

// @desc        Delete User
// @route       Delete api/v1/users/:id
// @access      Private (Admin)

exports.deleteSingleUserMethod = asyncHandler(async (req, res, next) => {
  const idOfUser = /[a-z]/gi.test(req.params.id) ? false : true;

  if (!idOfUser) {
    return res.status(400).json({ msg: "User Doesn't Exist" });
  }
  const data = await User.findByPk(req.params.id);
  // console.log(data);
  if (!data) {
    return res.status(404).json({ msg: "User Doesn't Exist" });
  }

  // await User.destroy({ where: { id: data.id } });

  await User.update(
    { isDeleted: true },
    {
      where: { id: req.params.id },
    }
  );

  return res.status(200).json({ msg: 'Your User has been Deleted' });
});
// @desc        ::Delete All User::
// @route       Delete /api/v1/customers
// @access      Private (Admin)

exports.deleteAllUserMethod = asyncHandler(async (req, res, next) => {
  const data = await User.findOne({});
  if (!data) {
    return res.status(404).json({ msg: 'No User to Delete' });
  }
  // await User.destroy({ truncate: { cascade: true } });
  await User.update(
    { isDeleted: true },
    {
      where: { isDeleted: false },
    }
  );

  return res.status(200).json({ msg: 'All User has been Deleted' });
});

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImlhdCI6MTU5OTAyNzgzMSwiZXhwIjoxNTk5MjAwNjMxfQ.d1SM0BGUGbTHvmybtGMh3U_eDafNZ9x_iKgold4ebRE
