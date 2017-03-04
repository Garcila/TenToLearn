const mongoose = require('mongoose');

//passport methods to the user model for authentication
const passportLocalMongoose = require('passport-local-mongoose');

//User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

//model
const User = mongoose.model('User', userSchema);

module.exports = User;
