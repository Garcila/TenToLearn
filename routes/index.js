const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//root
router.get('/', (req, res) => {
  res.render('landing');
});

//AUTH ROUTES_____________________________________________________________
//show regitster form
router.get('/register', (req, res) => {
  res.render('register');
});

//handle sign up logic
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/register');
      }
      passport.authenticate('local')(req, res, () => {
        req.flash('success', `Successfully logged is as ${user.username}`);
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
  req.flash('success', 'You Logged Out');
  res.redirect('/lists');
});

module.exports = router;
