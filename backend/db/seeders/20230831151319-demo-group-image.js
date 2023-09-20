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
          url: "https://media.istockphoto.com/id/1322123064/photo/portrait-of-an-adorable-white-cat-in-sunglasses-and-an-shirt-lies-on-a-fabric-hammock.jpg?s=612x612&w=0&k=20&c=-G6l2c4jNI0y4cenh-t3qxvIQzVCOqOYZNvrRA7ZU5o=",
          preview: false,
        },
        {
          groupId: 2,
          url: "https://images.all-free-download.com/images/graphiclarge/cat_cat_face_cats_eyes_240527.jpg",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://images.unsplash.com/photo-1602418013963-c1f017b3bb63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVhdXRpZnVsJTIwY2F0fGVufDB8fDB8fHww&w=1000&q=80",
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
