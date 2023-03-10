const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const config = require('../../config');
const Admin = require('../../models/Admin');


router.post(
  '/login',
  async (req, res) => {
    console.log(req.body);
    const { adminEmail, adminPass } = req.body;
    try {
      const admin = await Admin.findOne({ adminEmail });
      const isMatch = await bcrypt.compare(adminPass, admin.adminPass);
      console.log(isMatch);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        admin: {
          id: admin._id,
          email: admin.adminEmail,
          pass: admin.adminPass,
        }
      };

      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token:token, isAuth:true });
        }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
router.post(
  '/signUp',
  async (req, res) => {
    console.log(req.body);
    const { adminEmail, adminPass } = req.body;
    try {

      admin = new Admin({
        adminEmail,
        adminPass,
      });
      const salt = await bcrypt.genSalt(10);
      admin.adminPass = await bcrypt.hash(adminPass, salt);

      await admin.save();
      res.json({msg: 'okayAdmin'});

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
