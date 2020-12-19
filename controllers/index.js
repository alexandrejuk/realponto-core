const productController = require('./product')
const userController = require('./user')
const customerController = require('./customer')
const orderController = require('./order')
const serialNumberController = require('./serialNumber')
const authenticationController = require('./authentication')
const transactionController = require('./transaction')
const statusController = require('./status')

module.exports = {
  productController,
  userController,
  customerController,
  orderController,
  serialNumberController,
  authenticationController,
  transactionController,
  statusController,
}
