const Sequelize = require('sequelize')
const { ENUM_TRANSACTION } = require('../../utils/database/transaction/transaction.enum')

const Order = (sequelize) => {
  const Order = sequelize.define('order', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: Sequelize.ENUM(ENUM_TRANSACTION),
      allowNull: false,
      defaultValue: 'inputs',
    },
    pending_review: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  })

  Order.associate = (models) => {
    models.order.belongsTo(models.customer, {
      foreignKey: {
        allowNull: true,
      }
    })

    models.order.belongsTo(models.user, {
      foreignKey: {
        allowNull: true,
      }
    })

    models.order.hasMany(models.transaction, {
      foreignKey: {
        allowNull: true,
      }
    })

    models.order.hasMany(models.serialNumber, {
      foreignKey: {
        allowNull: true,
      }
    })
  }

  return Order
}

module.exports = Order
