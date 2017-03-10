const mongoose = require('mongoose');

//item schema
const itemSchema = mongoose.Schema({
  part_a: String,
  part_b: String,
  image: String
});
//model
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
