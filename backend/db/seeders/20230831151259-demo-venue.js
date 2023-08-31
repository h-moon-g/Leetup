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
          lat: 1.234567,
          lng: 2.345678,
        },
        {
          groupId: 1,
          address: "5678 Space Needle Ave",
          city: "Seattle",
          state: "Washington",
          lat: 3.456789,
          lng: 4.567890,
        },
        {
          groupId: 2,
          address: "1111 Corn Place",
          city: "Piqua",
          state: "Ohio",
          lat: 5.678901,
          lng: 6.789012,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        address: { [Op.in]: ["1234 Main Street", "5678 Space Needle Ave", "1111 Corn Place"] },
      },
      {}
    );
  },
};
