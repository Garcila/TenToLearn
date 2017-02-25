const mongoose = require('mongoose');

//passport methods to the user model for authentication
var passportLocalMongoose = require('passport-local-mongoose');

//User schema
let userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

//model
let User = mongoose.model('User', userSchema);

module.exports = User;
