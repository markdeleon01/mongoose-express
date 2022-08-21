// create initial data

const mongoose = require('mongoose')

const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => {
        console.log('mongodb connected')
    })
    .catch ( err => {
        console.log('mongodb connection error: ', err)
    })

const p = new Product({
    name: 'Ruby Grapefruit',
    price: 1.99,
    category: 'fruit'
})

p.save().then(p => {
    console.log(p)
}).catch( e => {
    console.log(e)
})
