"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
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
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: "123 Castle Road",
          city: "San Francisco",
          state: "California",
          country: "United States of America",
          lat: 37.7645358,
          lng: -122.4730327,
          name: "Castle in the Sky",
          description: "Explore a magical aerial adventure",
          price: 123,
        },
        {
          ownerId: 1,
          address: "456 Port City",
          city: "San Francisco",
          state: "California",
          country: "USA",
          lat: 37.7645358,
          lng: -122.4730327,
          name: "Port City Koriko",
          description: "Enjoy the warmth of fresh bread and friendly neighbors",
          price: 456,
        },
        {
          ownerId: 2,
          address: "789 Camphor Lane",
          city: "Orlando",
          state: "Florida",
          country: "United States of America",
          lat: 28.3772,
          lng: 81.5707,
          name: "Camphor Tree",
          description: "Discover a hidden, magical retreat",
          price: 789,
        },
        {
          ownerId: 2,
          address: "10 Secret Garden",
          city: "Urayasu",
          state: "Tokyo",
          country: "Japan",
          lat: 35.6267,
          lng: 139.8851,
          name: "Secret Garden",
          description: "Delve into a tucked away, lush garden",
          price: 10,
        },
        {
          ownerId: 3,
          address: "136 Tomocho",
          city: "Fukuyama",
          state: "Hiroshima",
          country: "Japan",
          lat: 35.6267,
          lng: 139.8851,
          name: "Old Port Town",
          description: "A quaint and charming port town",
          price: 136,
        },
        {
          ownerId: 3,
          address: "56 Dogo",
          city: "Matsuyama",
          state: "Ehime",
          country: "Japan",
          lat: 35.6267,
          lng: 139.8851,
          name: "The Bath House",
          description: "Replenish your spirit at The Bath House",
          price: 456,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
