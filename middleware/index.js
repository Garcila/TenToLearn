const List = require('../models/list');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.checkListOwnership = (req, res, next) => {
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

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect('back');
      } else {
        //if logged id, does user own comment
        if (comment.author.id.equals(req.user._id)) {
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

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = middlewareObj;
