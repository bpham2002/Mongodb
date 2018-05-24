var cheerio = require('cheerio')
var request = require('request')

// var $ = cheerio.load('<div><h1>hello World!</h1><p class="myfunclass">Blah blah</p></div>')
// $('.myfunclass').text()
// $('h1').addClass('weirdClass')
// console.log($.html())
var express = require('express')
var exphbs = require('express-handlebars');
var bodyparser = require('body-parser')
var mongoose = require('mongoose')
var db = require('./models')
mongoose.connect('mongodb://localhost/libraryDB')
var app = express()
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
request('https://stackoverflow.com', function(e, r, html) {
    if (e) throw e
    var $ = cheerio.load(html)
    $('.question-hyperlink').each(function(i, element) {
        var title = $(element).html()
            //console.log($(element).attr('href'))
        console.log(title)
    })
})
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.get('/weirdAuthor', function(req, res) {
    db.book.find({}).then(function(r) {
        var Book = db.book
        var changedBook = new Book(r[0])
        changedBook.changeTheAuthor()
        db.book.create(changedBook).then(function(r) {
            res.send(r)
        }).catch(function(e) {
            res.send(e)
        })
    }).catch(function(e) {
        res.send(e)
    })
})
app.post('/library', function(req, res) {
    db.library.create({
        name: 'myawesomelibrary',
        location: 'Irvine, CA',
        rating: 2
    }).then(function(r) {
        res.send(r)
    }).catch(function(r) {
        res.send(r)
    })
})

app.get('/library', function(req, res) {
    db.library.find({ 'name': 'myawesomelibrary' }).populate('books').then(function(r) {
        res.send(r)
    }).catch(function(e) {
        res.send(e)
    })
})

app.post('/book/new/:title/:pages/:author/:libraryname', function(req, res) {
    db.book.create({
        title: req.params.title,
        pages: req.params.pages,
        author: req.params.author
    }).then(function(r) {
        return db.library.update({ 'name': 'myawesomelibrary' }, { $push: { books: r._id } }).then(function(r) {
            res.send(r)
        })
    }).catch(function(e) {
        res.send(e)
    })
})

app.get('/book', function(req, res) {
    db.book.find({}).then(function(r) {
        res.send(r)
    }).catch(function(e) {
        res.send(e)
    })
})

app.put('/book/:title', function(req, res) {
    db.book.update({ 'title': req.params.title }, { $set: { 'pages': 9000 } }).then(function(r) {
        res.send(r)
    }).catch(function(e) {
        res.send(e)
    })
})

app.listen(3000, function(e) {
    if (e) throw e
    console.log('Listening on Port 3000')
})