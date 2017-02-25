//express setup
const express = require('express');

const app = express();

//mongodb object modeling
const mongoose = require('mongoose');

//passport
const passport = require('passport');
//for local strategy instead of twitter, facebook...
const LocalStrategy = require('passport-local');

//parse request bodies in middleware
const bodyParser = require('body-parser');

//sanitize your inputs
const expressSanitizer = require('express-sanitizer');

//enable use of verbs PUT and DELETE
const methodOverride = require('method-override');

//require created modules
const List = require('./models/list');
const Comment = require('./models/comment');
const User = require('./models/user');
// const User = require('./models/user');
const seedDB = require('./seeds');

//require routes
const commentRoutes = require('./routes/comments');
const listRoutes = require('./routes/lists');
const indexRoutes = require('./routes/index');

//define port to run on
const port = 3000;

app.use(expressSanitizer());

//set view engine to be ejs
app.set('view engine', 'ejs');

//enable serving static files from public folder
app.use(express.static(__dirname + '/public'));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

//Passport configuration
app.use(require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this way we can pass the user object to all routes and change items
//in the navbar depending if the user is logged in or not
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

//requiring routes
app.use(listRoutes);
app.use(indexRoutes);
app.use(commentRoutes);

// seedDB();

//DB CONFIG___________________________________________________________________
//setup db
mongoose.connect('mongodb://localhost/ten');

app.listen(port, () => console.log('Server staterted on port ' + port));
