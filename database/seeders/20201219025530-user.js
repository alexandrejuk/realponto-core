'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('users',[{
    id: 'us_a92a34bf-d0fc-4967-b78a-0ddf2955de4c',
    activated: true,
    name: 'Alexandre Soares',
    username: 'alexandre.soares',
    password: '$2b$10$5xUqXkUwblWquZumoLYSRuGUYHupV0Lir0z9M8gsTxA1uUwtGbONa',
    // 123456
    firstAccess: true
  }], {}),
  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
}
