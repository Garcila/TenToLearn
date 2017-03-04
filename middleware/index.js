const List = require('../models/list');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.checkListOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    List.findById(req.params.id, (err, list) => {
      if (err) {
        req.flash('error', 'There was a problem loading the List');
        res.redirect('/index');
        //if logged in, does user own list
      } else if (list.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You need to be the creator of that list ot do that');
          res.redirect('back');
        }
    });
  } else {
    req.flash('error', 'You need to be logged in to proceed');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, comment) => {
      if (err) {
        res.redirect('back');
        //if logged id, does user own comment
      } else if (comment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You need to be the creator of that comment ot do that');
          res.redirect('back');
        }
    });
  } else {
    req.flash('error', 'You need to be logged in to proceed');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to proceed');
  res.redirect('/login');
};

module.exports = middlewareObj;
