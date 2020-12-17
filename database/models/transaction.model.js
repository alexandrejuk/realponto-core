const Sequelize = require('sequelize')
const { ENUM_TRANSACTION } = require('../../utils/database/transaction/transaction.enum')

const Transaction = (sequelize) => {
  const Transaction = sequelize.define('transaction', {
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
    type: {
      type: Sequelize.ENUM(['inputs', 'outputs']),
      allowNull: false,
      defaultValue: 'inputs',
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  })

  Transaction.associate = (models) => {
    models.transaction.belongsTo(models.product, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.transaction.belongsTo(models.order, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Transaction
}

module.exports = Transaction
