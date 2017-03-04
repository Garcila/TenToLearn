const express = require('express');

const router = express.Router();
const List = require('../models/list');
const Comment = require('../models/comment');
const middleware = require('../middleware/index'); /* because it is named index,
     we do not have to include the word index...
     so('../middleware') by itself does the trick
     */

//comments new
router.get('/lists/:id/comments/new', middleware.isLoggedIn, (req, res) => {
  List.findById(req.params.id, (err, list) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { list: list });
    }
  });
});

//comments create
router.post('/lists/:id/comments', middleware.isLoggedIn, (req, res) => {
  List.findById(req.params.id, (err, list) => {
    if (err) {
      req.flash('error', 'Gremlins at work in the Database, please try again');
      res.redirect('/lists');
    } else {
      req.body.comment.text = req.sanitize(req.body.comment.text);
      Comment.create(req.body.comment, (errr, comment) => {
        if (err) {
          console.log(errr);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          list.comments.push(comment);
          list.save();
          req.flash('success', 'Comment successfully created');
          res.redirect(`/lists/${req.params.id}`);
        }
      });
    }
  });
});

//comments edit
router.get('/lists/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if (err) {
      res.redirect('back');
    }
    res.render('comments/edit', { comment: comment, list_id: req.params.id });
  });
});

//comments update
router.put('/lists/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
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
router.delete('/lists/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted as requested');

      res.redirect(`/lists/${req.params.id}`);
    }
  });
});

module.exports = router;
