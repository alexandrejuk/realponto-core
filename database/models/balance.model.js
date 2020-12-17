const Sequelize = require('sequelize')

const Balance = (sequelize) => {
  const Balance = sequelize.define('balance', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  })

  Balance.associate = (models) => {
    models.balance.belongsTo(models.product, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return Balance
}

module.exports = Balance
