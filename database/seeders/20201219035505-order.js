'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('orders',
  [{
    id: 'or_b8c2e248-4c84-4301-a03f-952ea72bcf94',
    statusId: 'st_dc093433-1fa0-409e-9c54-99488c3351fe',
    pendingReview: true,
    userId: 'us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c',
    customerId: 'co_93ac00e9-dc56-457b-ada0-f719679c0a6b',
  },
  {
    id: 'or_f52fe459-a134-4674-9970-42072b31cc93',
    statusId: 'st_dcfa0308-227f-45f1-a7ac-cedfc22fd7a5',
    pendingReview: true,
    userId: null,
    customerId: 'co_93ac00e9-dc56-457b-ada0-f719679c0a6b',
  },
  {
    id: 'or_479d7ec6-5897-457a-9967-693b8efceb7c',
    statusId: 'st_dc093433-1fa0-409e-9c54-99488c3351fe',
    pendingReview: true,
    userId: null,
    customerId:  null,
  }
], {}),

  down: (queryInterface) => queryInterface.bulkDelete('orders', null, {}),
}
