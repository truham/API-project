'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: '2023-02-01',
        endDate: '2023-02-28'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2023-03-01',
        endDate: '2023-03-31'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
    }, {});
  }
};
