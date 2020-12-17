const Sequelize = require('sequelize')

const SerialNumber = (sequelize) => {
  const SerialNumber = sequelize.define('serialNumber', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    serialNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  })

  SerialNumber.associate = (models) => {
    models.serialNumber.belongsTo(models.product, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.serialNumber.belongsTo(models.order, {
      foreignKey: {
        allowNull: false,
      }
    })

    models.serialNumber.belongsTo(models.user, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return SerialNumber
}

module.exports = SerialNumber
