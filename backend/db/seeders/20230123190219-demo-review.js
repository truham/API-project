'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: 'Fantastic location',
        stars: 5
      },
      {
        spotId: 2,
        userId: 1,
        review: 'Another fantastic location',
        stars: 4.4
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Superb location',
        stars: 4.5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Another superb location',
        stars: 4.7
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Luscious adventure',
        stars: 4.7
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
    }, {});
  }
};
