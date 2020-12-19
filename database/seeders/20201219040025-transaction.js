'use strict'
const uuidv4 = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('transactions',
  [{
    id: 'td_035017b5-769c-4000-9bd9-77fd7b380018',
    quantity: 10,
    userId: 'us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c',
    productId: 'pr_0b0ca960-2034-4048-8bde-a879d34e6b81',
    statusId:'st_dc093433-1fa0-409e-9c54-99488c3351fe',
    orderId: 'or_b8c2e248-4c84-4301-a03f-952ea72bcf94',
  },
  {
    id: 'td_a0a703ec-b6c6-4064-afa5-6f2d6dd16e56',
    quantity: 10,
    userId: 'us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c',
    productId: 'pr_a05b313b-8731-4d0f-9935-cce735c2d34d',
    statusId: 'st_dcfa0308-227f-45f1-a7ac-cedfc22fd7a5',
    orderId: 'or_b8c2e248-4c84-4301-a03f-952ea72bcf94',
  },

], {}),

  down: (queryInterface) => queryInterface.bulkDelete('transactions', null, {}),
}
