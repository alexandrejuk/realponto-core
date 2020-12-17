const Sequelize = require('sequelize')

const Product = (sequelize) => {
  const Product = sequelize.define('product', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    minQuantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
  })

  return Product
}

module.exports = Product
