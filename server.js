const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');

const Author = require('./Authors/AuthorModel.js');
const Book = require('./Books/BookModel.js');

const server = express();

server.use(helmet());
server.use(bodyParser.json());

// Your API will be built out here.
server.get('/', function(req, res) {
  res.status(200).json({ api: 'running' });
});

server.get('/books', (req, res) => {
  Book.find()
    .populate('authors', 'firstName lastName')
    .select('title')
    .then(books => {
      res.status(200).json(books)
    })
    .catch(error => {
      res.json(500).json({error});
    })
});

server.get('/authors', (req, res) => {
  Author.find({firstName: 'Martin'})
    .select('_id')
    .then(ids => {
      Book.find()
        .where('authors')
        .in(ids)
        .populate('authors', 'firstName lastName')
        .then(books => {
          res.status(200).json(books);
        })
    })
    .catch(error => {
      res.status(500).json({error});
    })
});

mongoose.connect('mongodb://localhost/cs6').then(
  () => {
    const port = process.env.PORT || 3000;
    server.listen(port);
    console.log(`Server Listening on ${port}`);
  },
  err => {
    console.log('\n************************');
    console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
    console.log('************************\n');
  }
);
