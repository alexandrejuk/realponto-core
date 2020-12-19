const Sequelize = require('sequelize')

const Product = (sequelize) => {
  const Product = sequelize.define('product', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
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

  Product.associate = (models) => {
    models.product.hasMany(models.serialNumber, {
      foreignKey: {
        allowNull: true,
      }
    })
  }

  return Product
}

module.exports = Product
