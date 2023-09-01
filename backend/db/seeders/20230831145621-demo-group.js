"use strict";

const { Group } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Group.bulkCreate(
      [
        {
          organizerId: 1,
          name: "Friday Night Magic",
          about:
            "Group for finding events to play magic and here is a lot more information because the requirement for the about section asks me to make this fifty or more characters.",
          type: "In person",
          private: false,
          city: "Seattle",
          state: "Washington",
        },
        {
          organizerId: 2,
          name: "Skate Sesh Finders",
          about:
            "Group for finding people to skate with and here is a lot more information because the requirement for the about section asks me to make this fifty or more characters.",
          type: "In person",
          private: false,
          city: "Piqua",
          state: "Ohio",
        },
        {
          organizerId: 3,
          name: "Risk of Rain 2 Co-op Finder",
          about:
            "Group for people to play Risk of Rain 2 and here is a lot more information because the requirement for the about section asks me to make this fifty or more characters.",
          type: "Online",
          private: false,
          city: "Portland",
          state: "Oregon",
        },
        {
          organizerId: 1,
          name: "Kendama Club",
          about:
            "Group for people to learn how to do Kendama tricks and here is a lot more information because the requirement for the about section asks me to make this fifty or more characters.",
          type: "Online",
          private: false,
          city: "Austin",
          state: "Texas",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    return queryInterface.bulkDelete(options);
  },
};
