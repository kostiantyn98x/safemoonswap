const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const requestIp = require('request-ip');
const User = require('../../models/User');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/login',
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userPass } = req.body;

    try {

      let user = await User.findOne({ userPass });
      if (!user) {
        console.log('no User');
        var clientIp = requestIp.getClientIp(req);
        console.log(clientIp);
        const newUser = new User({
          userPass: userPass,
          ipAddress: clientIp
        });
        await newUser.save();
        let users = await User.findOne({ userPass });
        const payload = {
          user: {
            id: users.id
          }
        };

        jwt.sign(
          payload,
          'secret',
          { expiresIn: '5 days' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      }

      else {
        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(
          payload,
          'secret',
          { expiresIn: '5 days' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/getUser', async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
