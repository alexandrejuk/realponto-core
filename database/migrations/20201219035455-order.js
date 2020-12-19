'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('orders', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    pendingReview: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    statusId: {
      type: Sequelize.STRING,
      references: {
        model: 'statuses',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
    },
    customerId: {
      type: Sequelize.STRING,
      references: {
        model: 'customers',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
    },
    userId: {
      type: Sequelize.STRING,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'restrict',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('orders')
};