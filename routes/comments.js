const express = require('express');

const router = express.Router();
const List = require('../models/list');
const Comment = require('../models/comment');

//comments new
router.get('/lists/:id/comments/new', isLoggedIn, (req, res) => {
  List.findById(req.params.id, (err, list) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { list: list });
    }
  });
});

//comments create
router.post('/lists/:id/comments', isLoggedIn, (req, res) => {
  List.findById(req.params.id, (err, list) => {
    if (err) {
      console.log(err);
      res.redirect('/lists');
    } else {
      console.log(req.body);
      req.body.comment = req.sanitize(req.body.comment);
      console.log(req.body);
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          list.comments.push(comment);
          list.save();
          res.redirect(`/lists/${req.params.id}`);
        }
      });
    }
  });
});

//comments edit
router.get('/lists/:id/comments/:comment_id/edit', (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    }
    res.render('comments/edit', { comment: comment, list_id: req.params.id });
  });
});

//comments update
router.put('/lists/:id/comments/:comment_id', (req, res) => {
  req.body.comment.text = req.sanitize(req.body.comment.text);
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.redirect(`/lists/${req.params.id}`);
    }
  });
});


//comments destroy
router.delete('/lists/:id/comments/:comment_id', (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      console.log(err);
      res.redirect(`/lists/${req.params.id}`);
    } else {
      res.redirect(`/lists/${req.params.id}`);
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
