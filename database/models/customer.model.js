const Sequelize = require('sequelize')
const uuidv4Generator = require('../../utils/helpers/hash')

const Customer = (sequelize) => {
  const Customer = sequelize.define('customer', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4Generator('co_')
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    document: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  })

  return Customer
}

module.exports = Customer
