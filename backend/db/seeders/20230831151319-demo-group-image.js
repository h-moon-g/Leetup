"use strict";

const { GroupImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dcat&psig=AOvVaw0ZLTg1nn1JXgSbdEOfcca1&ust=1693956572607000&source=images&cd=vfe&opi=89978449&ved=0CA8QjRxqFwoTCOiI8ZCOkoEDFQAAAAAdAAAAABAE",
          preview: true,
        },
        {
          groupId: 2,
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fcat%2F&psig=AOvVaw0ZLTg1nn1JXgSbdEOfcca1&ust=1693956572607000&source=images&cd=vfe&opi=89978449&ved=0CA8QjRxqFwoTCOiI8ZCOkoEDFQAAAAAdAAAAABAJ",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dcat&psig=AOvVaw0ZLTg1nn1JXgSbdEOfcca1&ust=1693956572607000&source=images&cd=vfe&opi=89978449&ved=0CA8QjRxqFwoTCOiI8ZCOkoEDFQAAAAAdAAAAABAP",
          preview: true,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    return queryInterface.bulkDelete(options);
  },
};
