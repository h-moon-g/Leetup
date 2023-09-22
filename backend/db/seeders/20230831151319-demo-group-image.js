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
          url: "https://static.vecteezy.com/system/resources/thumbnails/002/098/204/small/silver-tabby-cat-sitting-on-green-background-free-photo.jpg",
          preview: true,
        },
        {
          groupId: 1,
          url: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Young_cats.jpg",
          preview: false,
        },
        {
          groupId: 2,
          url: "https://images.all-free-download.com/images/graphiclarge/cat_cat_face_cats_eyes_240527.jpg",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://hips.hearstapps.com/hmg-prod/images/cute-photos-of-cats-looking-at-camera-1593184780.jpg",
          preview: true,
        },
        {
          groupId: 4,
          url: "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_1280.jpg",
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
