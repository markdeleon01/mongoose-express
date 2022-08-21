const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')

//lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
const methodOverride = require('method-override')

const Product = require('./models/product')

//connect to the Mongoose database
mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true})
    .then( () => {
        console.log('mongodb connected')
    })
    .catch ( err => {
        console.log('mongodb connection error: ', err)
    })

//set up EJS views
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//use middleware that only parses urlencoded bodies
//and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded( { extended: true}))

//use middleware to use a query string value to override the method
app.use(methodOverride('_method'))

////////////////////////////////////////
// define the product categories
const categories = ['fruit', 'vegetable', 'dairy']

////////////////////////////////////////
// set up routes
app.get('/products', async (req, res) => {
    const { category } = req.query
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }
})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories }) //display the form
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save()
    res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('products/show', { product })
})

app.get('/products/:id/edit', async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('products/edit', { product, categories })
})

app.put('/products/:id', async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true })
    res.redirect(`/products/${product._id}`)
})

app.delete('/products/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    res.redirect('/products')
})

////////////////////////////////////////

//listen on port 3000
app.listen(3000, () => {
    console.log('app listening on port 3000')
})
