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

// @route    POST api/users/signUp
// @desc     Register user
// @access   Public
router.post(
  '/signUp',
  async (req, res) => {
    console.log(req.body);
    const { userName, userEmail, userPass } = req.body;

    try {
      let user = await User.findOne({ $or: [ { 'userEmail': userEmail }, { 'userPass': userPass } ] });
      console.log(user);
      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'User already exists' }] });
      }

      user = new User({
        userName,
        userEmail,
        userPass
      });
      console.log(user);
      await user.save();  

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
