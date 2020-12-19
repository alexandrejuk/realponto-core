const Sequelize = require('sequelize')

const Customer = (sequelize) => {
  const Customer = sequelize.define('customer', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
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
