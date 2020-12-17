const Sequelize = require('sequelize')

const SerialNumber = (sequelize) => {
  const SerialNumber = sequelize.define('serialNumber', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    serial_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    transaction_in_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    transaction_out_id: {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
    },
  })

  SerialNumber.associate = (models) => {

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

    models.serialNumber.belongsTo(models.product, {
      foreignKey: {
        allowNull: false,
      }
    })
  }

  return SerialNumber
}

module.exports = SerialNumber
