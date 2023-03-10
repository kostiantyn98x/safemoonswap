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

// @route    POST api/users/signUp
// @desc     Register user
// @access   Public
router.post(
  '/sendRequest',
  async (req, res) => {
    
    const { userPass, stakeAmount, walletAddress } = req.body;
    console.log(req.body);
    try {
      var date = new Date();
      // console.log(date);
      let newDate = new Date(date.setDate(date.getDate() + 30)); 
      let stakesOfNow = await Stake.find({ $or: [ { 'waitStatus': 1 }, { 'waitStatus': 2 }, { 'waitStatus': 3 } ] });
      stake = new Stake({
        userPass: userPass,
        stakeIndex: stakesOfNow.length + 1,
        stakeAmount: stakeAmount,
        endDate : newDate,
        waitStatus : 2,
        walletAddress: walletAddress,
        newFlag: 0,
      });
      await stake.save();        

      res.json({msg:'success'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
router.post(
  '/sendUnStakeRequest',
  async (req, res) => {
    
    const { userPass } = req.body;
    try {
      await Stake.updateOne({userPass:userPass},{$set:{'waitStatus':3}});
      res.json({msg:'success'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
router.post(
  '/sendUnStakeResponse',
  async (req, res) => {
    
    const { userPass } = req.body;
    try {
      // console.log('------- reject -------', userPass);
      await Stake.updateOne({userPass:userPass},{$set:{'waitStatus':0}});
      res.json({msg:'success'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
router.post(
  '/sendUnStakeRejectResponse',
  async (req, res) => {
    
    const { userPass } = req.body;
    try {
      console.log('------- reject -------', userPass);
      await Stake.updateOne({'userPass':userPass},{$set:{'waitStatus':2}});
      res.json({msg:'success'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
router.post(
  '/changeNewFlag',
  async (req, res) => {
    
    const { id } = req.body;
    console.log(id);
    try {        
      let stakes = await Stake.updateOne({'_id':id},{$set:{'newFlag':true}});
      res.json({msg:'changeNewFlag'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get(
  '/getStake',
  async (req, res) => {  
      try {
        let stakes = await Stake.find({ $or: [ { 'waitStatus': 1 }, { 'waitStatus': 2 }, { 'waitStatus': 3 } ] }).sort({ 'endDate': -1, 'newFlag': 1});        
        console.log(stakes);
        let nstakes = stakes.map((item) => {
          var current=Date.now()/1000; 
          var ms = Date.parse(item.endDate)/1000;
          if (current < ms && item.waitStatus !== 0) {          
            var reward = ((30 - (ms-current) / 60 / 60 / 24) * item.stakeAmount * 0.01).toFixed(3);
          }
          console.log('--reward',reward)
          item = Object.assign({ reward: reward }, item);
          return item;
        })
        res.json({stake:nstakes});
      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
  }
);

router.post(
  '/changeStatus',
  async (req, res) => {
      const { ids, changeStatus } = req.body;  
      try {  
        var date = new Date();
        console.log(date);
        let newDate = new Date(date.setDate(date.getDate() + 30)); 
        let stakes = await Stake.updateOne({'_id':ids},{$set:{'waitStatus':changeStatus, 'endDate':newDate}});        
        console.log(stakes);
        res.json({stake:stakes});
      }
      catch (err) {
        console.error("err-end", err.message);
        res.status(500).send('Server error');
      }
  }
);

router.post(
  '/getById',
  async (req, res) => {
      const { userPass } = req.body;  
      try {          
        stake = await Stake.find({userPass: userPass});
        console.log('--stake', stake);
        var current=Date.now()/1000; 
        var ms = Date.parse(stake[0].endDate)/1000;
        if (current < ms && stake[0].waitStatus !== 0) {          
          var reward = ((30 - (ms-current) / 60 / 60 / 24) * stake[0].stakeAmount * 0.01).toFixed(3);
          console.log(reward);
          res.json({stake:stake, reward:reward});
        }
        else
          res.json({msg:'noStake'});
      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
  }
);

router.post(
  '/delete',
  async (req, res) => {
      const { userPass } = req.body;  
      try {          
        Stake.deleteMany().then(res => {
          console.log('success delete')
        })
        res.json({msg:'delete success'});        
      }
      catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
  }
);


module.exports = router;
