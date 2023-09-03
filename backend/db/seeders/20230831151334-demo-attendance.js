"use strict";

const { Attendance } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Attendance.bulkCreate(
      [
        {
          eventId: 1,
          userId: 1,
          status: "attending",
        },
        {
          eventId: 2,
          userId: 2,
          status: "pending",
        },
        {
          eventId: 1,
          userId: 2,
          status: "pending",
        },
        {
          eventId: 3,
          userId: 3,
          status: "attending",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    return queryInterface.bulkDelete(options);
  },
};
