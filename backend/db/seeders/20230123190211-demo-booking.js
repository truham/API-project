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
        startDate: new Date ('2023-02-01'),
        endDate: new Date ('2023-02-28')
      },
      {
        spotId: 1,
        userId: 2,
        startDate: new Date ('2023-06-01'),
        endDate: new Date ('2023-06-28')
      },
      {
        spotId: 1,
        userId: 3,
        startDate: new Date ('2023-08-01'),
        endDate: new Date ('2023-08-28')
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date ('2023-03-01'),
        endDate: new Date ('2023-03-31')
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date ('2023-04-01'),
        endDate: new Date ('2023-04-30')
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
