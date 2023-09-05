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
          about: "Group for finding events to play magic.",
          type: "In person",
          private: false,
          city: "Seattle",
          state: "Washington",
        },
        {
          organizerId: 2,
          name: "Skate Sesh Finders",
          about: "Group for finding people to skate with.",
          type: "In person",
          private: false,
          city: "Piqua",
          state: "Ohio",
        },
        {
          organizerId: 3,
          name: "Risk of Rain 2 Co-op Finder",
          about: "Group for people to play Risk of Rain 2.",
          type: "Online",
          private: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "Friday Night Magic",
            "Skate Sesh Finders",
            "Risk of Rain 2 Co-op Finder",
          ],
        },
      },
      {}
    );
  },
};
