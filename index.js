const Express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = Express()

const productRoutes = require('./routes/product')
const userRoutes = require('./routes/user')
const customerRoutes = require('./routes/customer')
const orderRoutes = require('./routes/order')
const authenticationRoutes = require('./routes/authentication')
const serialNumberRoutes = require('./routes/serialNumber')
const transactionRoutes = require('./routes/transaction')

const { authenticationController } = require('./controllers/')

const baseUrl = '/api'

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/auth', authenticationRoutes)
app.use(baseUrl, authenticationController.checkToken)
app.use(baseUrl, serialNumberRoutes)
app.use(baseUrl, transactionRoutes)
app.use(baseUrl, orderRoutes)
app.use(baseUrl, productRoutes)
app.use(baseUrl, userRoutes)
app.use(baseUrl, customerRoutes)

module.exports = app
