const Sequelize = require('sequelize')

const Status = (sequelize) => {
  const Status = sequelize.define('status', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
    },
    activated: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM(['inputs', 'outputs']),
      allowNull: false,
      defaultValue: 'inputs',
    },
    typeLabel: {
      type: Sequelize.ENUM(['Entrada', 'Saída']),
      allowNull: false,
    },
  })

  return Status
}

module.exports = Status
