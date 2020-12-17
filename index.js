const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = Express()

const productRoutes = require('./routes/product')
const userRoutes = require('./routes/user')
const customerRoutes = require('./routes/customer')

const baseUrl = '/api'

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(baseUrl, productRoutes)
app.use(baseUrl, userRoutes)
app.use(baseUrl, customerRoutes)

module.exports = app
