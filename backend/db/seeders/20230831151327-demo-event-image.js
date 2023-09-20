"use strict";

const { EventImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await EventImage.bulkCreate(
      [
        {
          eventId: 1,
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Cat_Sphynx._Kittens._img_11.jpg/1280px-Cat_Sphynx._Kittens._img_11.jpg",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://img.freepik.com/free-photo/beautiful-shot-white-british-shorthair-kitten_181624-57681.jpg",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://images.all-free-download.com/images/graphiclarge/cat_in_the_city_208264.jpg",
          preview: true,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    return queryInterface.bulkDelete(options);
  },
};
