const express = require('express');

const router = express.Router();
const List = require('../models/list');

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
router.get('/lists/new', isLoggedIn, (req, res) => {
  res.render('lists/new');
});

//create
router.post('/lists', isLoggedIn, (req, res) => {
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
      console.log('done');
      res.render('lists/show', { list: list });
    }
  });
});

//edit
router.get('/lists/:id/edit', checkListOwnership, (req, res) => {
  List.findById(req.params.id, (err, list) => {
    res.render('lists/edit', { list: list });
  });
});

//update
router.put('/lists/:id', checkListOwnership, (req, res) => {
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
router.delete('/lists/:id', checkListOwnership, (req, res) => {
  List.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.redirect(`/lists/${req.params.id}`);
    } else {
      res.redirect('/lists');
    }
  });
});

//middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkListOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    List.findById(req.params.id, (err, list) => {
      if (err) {
        res.redirect('/index');
      } else {
        //if logged in, does user own list
        if (list.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
}

module.exports = router;
