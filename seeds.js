const mongoose = require('mongoose');
const List = require('./models/list');
const Comment = require('./models/comment');

let data = [
  {
    title: 'Number One',
    image: 'https://goo.gl/CX063l',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'Science'
  },
  {
    title: 'Number Two',
    image: 'https://goo.gl/nvD3wC',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    category: 'Art'
  },
  {
    title: 'Number Three',
    image: 'https://goo.gl/nJ6GmY',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    category: 'History'
  }
];

function seedDB() {
  //remove all lists
  List.remove({}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Lists removed');
      //add lists
      data.forEach((seed) => {
        List.create(seed, (err, list) => {
          if (err) {
            console.log(err);
          } else {
            console.log('added a list');
            //create a comment
            Comment.create(
              {
                text: 'to be changed if needed',
                author: 'Prrrrrr'
              }, (err, comment) => {
                if (err) {
                  console.log(err);
                } else {
                  list.comments.push(comment);
                  list.save();
                  console.log('created comment');
                }
              }
            );
          }
        });
      });
    }
  });
}

module.exports = seedDB;
