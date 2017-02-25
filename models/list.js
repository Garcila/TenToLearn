const mongoose = require('mongoose');

//list schema
let listSchema = mongoose.Schema({
  title: String,
  image: String,
  description: String,
  category: String,
  date: {type: Date, default: Date.now},
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});
//model
let List = mongoose.model('List', listSchema);

module.exports = List;