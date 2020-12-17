const Sequelize = require('sequelize')

const Customer = (sequelize) => {
  const Customer = sequelize.define('customer', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  return Customer
}

module.exports = Customer
