const mongoose = require('mongoose');

//list schema
let commentSchema = mongoose.Schema({
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
let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
