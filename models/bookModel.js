var mongoose = require('mongoose')

var Schema = mongoose.Schema

var book = new Schema({
  title: {
    type: String,
    required: true
  },
  pages: {
    type: Number
  },
  author: {
    type: String,
    required: true
  },
  isAGoodBook: {
    type: Boolean
  }
})

book.methods.changeTheAuthor = function () {
  this.author = 'Pabloz'
  return this.author
}

module.exports = mongoose.model('book', book)
