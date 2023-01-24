'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

// import user model to make ownerId dynamic by finding by firstName?
// similar to week 11's pa with players, sport, team, etc
// const { Spot, User } = require('../models')

// tried to make it dynamic via similar code from wk11, 
// but for now, move on with direct ownerId input
  // for (let spot of spots) {
  //   const { firstName } = spot
  //   const findOwner = await User.findOne({
  //     where: firstName
  //   })
  //   await Spot.create({
  //     ownerId: findOwner.id,
  //   })
  // }

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
      },
      {
        ownerId: 2,
        address: '456 Disney World',
        city: 'Orlando',
        state: 'Florida',
        country: 'United States of America',
        lat: 28.3772,
        lng: 81.5707,
        name: "Disney World",
        description: "A wonderful resort",
        price: 456,
      },
      {
        ownerId: 3,
        address: '789 Disney Sea',
        city: 'Urayasu',
        state: 'Tokyo',
        country: 'Japan',
        lat: 35.6267,
        lng: 139.8851,
        name: "Disney Sea",
        description: "A nautical adventure",
        price: 456,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
    }, {});
  }
};
