const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const config = require('../../config');
const User = require('../../models/User');
const Stake = require('../../models/Stake');
const Admin = require('../../models/Admin');

// @route    POST api/users/signUp
// @desc     Register user
// @access   Public
router.get(
  '/stakeCollectionDrop',
  async (req, res) => {

    try {
      console.log('successfully stake deleted');
      res.send('successfully stake deleted');
    } catch (err) {
      console.error(err.message);+
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
