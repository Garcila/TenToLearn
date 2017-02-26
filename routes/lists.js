const express = require('express');

const router = express.Router();
const List = require('../models/list');
const middleware = require('../middleware/index'); /* because it is named index,
     we do not have to include the word index...
     so('../middleware') by itself does the trick
     */

//index
router.get('/lists', (req, res) => {
  List.find({}, (err, list) => {
    if (err) {
      console.log(err);
    } else {
      res.render('lists/index', { lists: list });
    }
  });
});

//new
router.get('/lists/new', middleware.isLoggedIn, (req, res) => {
  res.render('lists/new');
});

//create
router.post('/lists', middleware.isLoggedIn, (req, res) => {
  // req.body.list.description = req.sanitize(req.body.list.description);
  List.create(req.body.list, (err, createdList) => {
    if (err) {
      console.log(err);
      res.render('lists/new');
    } else {
      //add username and id to list
      createdList.author.id = req.user._id;
      createdList.author.username = req.user.username;
      //save list
      createdList.save();
      console.log(createdList);
      res.redirect('/lists');
    }
  });
});

//show
router.get('/lists/:id', (req, res) => {
  //find list with id, populate with referenced comments
  List.findById(req.params.id).populate('comments').exec((err, list) => {
    if (err) {
      console.log(err);
      res.redirect('/lists');
    } else {
      res.render('lists/show', { list: list });
    }
  });
});

//edit
router.get('/lists/:id/edit', middleware.checkListOwnership, (req, res) => {
  List.findById(req.params.id, (err, list) => {
    res.render('lists/edit', { list: list });
  });
});

//update
router.put('/lists/:id', middleware.checkListOwnership, (req, res) => {
  req.body.list.body = req.sanitize(req.body.list.body);
  List.findByIdAndUpdate(req.params.id, req.body.list, (err, list) => {
    if (err) {
      console.log(err);
      res.render('lists/index');
    } else {
      res.redirect(`/lists/${req.params.id}`);
    }
  });
});

//destroy
router.delete('/lists/:id', middleware.checkListOwnership, (req, res) => {
  List.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.redirect(`/lists/${req.params.id}`);
    } else {
      res.redirect('/lists');
    }
  });
});

module.exports = router;
