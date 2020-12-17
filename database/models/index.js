const Product = require('./product.model')
const Order = require('./order.model')
const Transaction = require('./transaction.model')
const Customer = require('./customer.model')
const User = require('./user.model')
const SerialNumber = require('./serialNumber.model')

module.exports = [
  Product,
  Transaction,
  Order,
  Customer,
  User,
  SerialNumber,
]
