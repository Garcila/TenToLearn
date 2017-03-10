const express = require('express');

const router = express.Router();
const List = require('../models/list');
const Item = require('../models/item');
const middleware = require('../middleware/index'); /* because it is named index,
     we do not have to include the word index...
     so('../middleware') by itself does the trick
     */

//items new
router.get('/lists/:id/items/new', middleware.isLoggedIn, (req, res) => {
  List.findById(req.params.id, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      res.render('lists/new', { item: item });
    }
  });
});

//items create
router.post('/lists/:id/items', middleware.isLoggedIn, (req, res) => {
  List.findById(req.params.id, (err, list) => {
    if (err) {
      req.flash('error', 'Gremlins at work in the Database, please try again');
      res.redirect('/lists');
    } else {
      const partA = req.sanitize(req.body.list.part_a);
      const partB = req.sanitize(req.body.list.part_b);
      const image = req.body.list.image;
      const newItem = { partA, partB, image };
      Item.create(newItem, (errr, item) => {
        if (err) {
          console.log(errr);
        } else {
          //add username and id to item
          item.author.id = req.user._id;
          item.author.username = req.user.username;
          //save item
          item.save();
          list.items.push(item);
          list.save();
          req.flash('success', 'Item successfully created');
          res.redirect(`/lists/${req.params.id}`);
        }
      });
    }
  });
});

module.exports = router;
