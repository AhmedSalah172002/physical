const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');

const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const createToken = require('../utils/createToken');
const User = require('../models/userModel');



exports.createFilterObj = (req, res, next) => {
  let filterObject = {role: req.user.role == 'patient'? 'doctor' :'patient'};
  req.filterObj = filterObject;
  req.user.role == 'patient'?  req.fields= '-doctors -requests' : req.fields= '-recives -patients' 
  next();
};


// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Protect
exports.getUsers = factory.getAll(User)

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Protect
exports.getUser = factory.getOne(User);

// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

