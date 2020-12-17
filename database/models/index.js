const Product = require('./product.model')
const Balance = require('./balance.model')
const Order = require('./order.model')
const Transaction = require('./transaction.model')
const Customer = require('./customer.model')
const User = require('./user.model')
const SerialNumber = require('./serialNumber.model')

module.exports = [
  Balance,
  Product,
  Transaction,
  Order,
  Customer,
  User,
  SerialNumber,
]
