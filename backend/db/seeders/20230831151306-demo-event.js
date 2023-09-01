"use strict";

const { Event } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate(
      [
        {
          venueId: 1,
          groupId: 1,
          name: "Friday Night Commander",
          description:
            "Friday Night Commander at 1234 Main Street! Bring your friends!",
          type: "In person",
          capacity: 50,
          price: 0,
          startDate: "2023-09-01",
          endDate: "2023-09-01",
        },
        {
          venueId: 2,
          groupId: 1,
          name: "Sunday Night Modern Tournament",
          description:
            "Modern on Sunday night. Pay an admission to get a chance to win packs.",
          type: "In person",
          capacity: 24,
          price: 20,
          startDate: "2023-09-03",
          endDate: "2023-09-03",
        },
        {
          venueId: 3,
          groupId: 2,
          name: "Let's Skate at the New Park!",
          description: "New park just opened! Lets skate it all weekend!",
          type: "In person",
          capacity: 64,
          price: 0,
          startDate: "2023-09-02",
          endDate: "2023-09-03",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    return queryInterface.bulkDelete(options);
  },
};
