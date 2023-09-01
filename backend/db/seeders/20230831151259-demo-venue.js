"use strict";

const { Venue } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Venue.bulkCreate(
      [
        {
          groupId: 1,
          address: "1234 Main Street",
          city: "Seattle",
          state: "Washington",
          lat: 11.2345678,
          lng: 222.3456789,
        },
        {
          groupId: 1,
          address: "5678 Space Needle Ave",
          city: "Seattle",
          state: "Washington",
          lat: 33.4567899,
          lng: 44.5678901,
        },
        {
          groupId: 2,
          address: "1111 Corn Place",
          city: "Piqua",
          state: "Ohio",
          lat: -555.6789012,
          lng: -66.7890123,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    return queryInterface.bulkDelete(options);
  },
};
