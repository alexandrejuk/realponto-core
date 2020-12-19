const Sequelize = require('sequelize')

const Transaction = (sequelize) => {
  const Transaction = sequelize.define('transaction', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
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

    models.transaction.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.transaction.belongsTo(models.status, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Transaction
}

module.exports = Transaction
