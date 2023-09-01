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
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fimages%2Fanimals%2Fcat&psig=AOvVaw0ZLTg1nn1JXgSbdEOfcca1&ust=1693956572607000&source=images&cd=vfe&opi=89978449&ved=0CA8QjRxqFwoTCOiI8ZCOkoEDFQAAAAAdAAAAABAV",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fdomestic-cat&psig=AOvVaw0ZLTg1nn1JXgSbdEOfcca1&ust=1693956572607000&source=images&cd=vfe&opi=89978449&ved=0CA8QjRxqFwoTCOiI8ZCOkoEDFQAAAAAdAAAAABAa",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fblack-cat&psig=AOvVaw0ZLTg1nn1JXgSbdEOfcca1&ust=1693956572607000&source=images&cd=vfe&opi=89978449&ved=0CA8QjRxqFwoTCOiI8ZCOkoEDFQAAAAAdAAAAABAg",
          preview: true,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    return queryInterface.bulkDelete(
      options
    );
  },
};
