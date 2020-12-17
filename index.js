const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = Express()

const productRoutes = require('./routes/product')

const baseUrl = '/api'

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(baseUrl, productRoutes)

module.exports = app
