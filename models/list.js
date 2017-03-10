const mongoose = require('mongoose');

//list schema
const listSchema = mongoose.Schema({
  title: String,
  image: String,
  description: String,
  category: String,
  date: { type: Date, default: Date.now },
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
  ],
  item: {
    part_a: String,
    part_b: String,
    image: String
  }
});
//model
const List = mongoose.model('List', listSchema);

module.exports = List;
