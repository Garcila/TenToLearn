const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//root
router.get('/', (req, res) => {
  res.redirect('/lists');
});

//AUTH ROUTES_____________________________________________________________
//show regitster form
router.get('/register', (req, res) => {
  res.render('register');
});

//handle sign up logic
router.post('/register', (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        return res.render('register');
      }
      passport.authenticate('local')(req, res, () => {
        res.redirect('/lists');
      });
    });
});

//show login form
router.get('/login', (req, res) => {
  res.render('login');
});

//handle login logic
router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/lists',
    failureRedirect: '/login'
  }), (req, res) => {
});

//logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/lists');
});

module.exports = router;
