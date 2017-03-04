const mongoose = require('mongoose');

//list schema
const commentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
});

//model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
