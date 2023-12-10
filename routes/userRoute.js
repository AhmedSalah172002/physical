const express = require('express');
const {
  getUserValidator,
} = require('../utils/validators/userValidator');

const {
  getUsers,
  getUser,
  getLoggedUserData,
  createFilterObj,
} = require('../services/userService');
const { protect, allowedTo } = require('../services/authService');


const router = express.Router();

router.use(protect);

router.get('/getMe', getLoggedUserData, getUser);

router
  .route('/')
  .get(createFilterObj,getUsers)
router
  .route('/:id')
  .get(getUserValidator, getUser)

module.exports = router;
