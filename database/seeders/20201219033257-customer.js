'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('customers',
  [{
    id: 'co_93ac00e9-dc56-457b-ada0-f719679c0a6b',
    name: 'Company test development',
    document: '11222333000100'
  },
  {
    id: 'co_4e4a1a5d-ab00-49f0-98a8-ec018543b3a3',
    name: 'Company test development 1',
    document: '11222333000101'
  },
  {
    id: 'co_5525fa9a-9fcc-46f0-a99b-cf186d5ace58',
    name: 'Company test development 2',
    document: '11222333000102'
  },
  {
    id: 'co_b7d1a40d-e832-4ac8-aa5a-96002d4f63fe',
    name: 'Company test development 3',
    document: '11222333000103'
  },
], {}),

  down: (queryInterface) => queryInterface.bulkDelete('customers', null, {}),
}
