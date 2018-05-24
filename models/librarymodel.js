var mongoose = require('mongoose')

var Schema = mongoose.Schema

var library = new Schema({
  name: {
    type: String
  },
  location: {
    type: String
  },
  rating: {
    type: Number
  },
  books: [{
    type: Schema.Types.ObjectId,
    ref: 'book'
  }]
})

module.exports = mongoose.model('library', library)
