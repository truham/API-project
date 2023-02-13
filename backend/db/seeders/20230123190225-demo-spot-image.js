"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    return queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          url: "https://cdn.vox-cdn.com/thumbor/vTli5-nSDxomQgxyCWlew0yGvWs=/1400x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/19998769/GHI_CastleInTheSky__Select2.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://i.ytimg.com/vi/E1q5F6a78-A/maxresdefault.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://c4.wallpaperflare.com/wallpaper/619/548/909/fantasy-art-anime-studio-ghibli-my-neighbor-totoro-wallpaper-preview.jpg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://wallpapers.com/images/hd/scenic-garden-howl-s-moving-castle-dz82vh10epu7ahxi.jpg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://images.lifestyleasia.com/wp-content/uploads/sites/3/2020/02/10011802/Image-credit_studioghiblimovies-1024x576.jpg",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://wallpaper.dog/large/17196451.jpg",
          preview: true,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
