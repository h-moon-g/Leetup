"use strict";

const { Membership } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Membership.bulkCreate(
      [
        {
          userId: 1,
          groupId: 1,
          status: "Host",
        },
        {
          userId: 1,
          groupId: 4,
          status: "Host",
        },
        {
          userId: 2,
          groupId: 2,
          status: "Host",
        },
        {
          userId: 3,
          groupId: 3,
          status: "Host",
        },
        {
          userId: 2,
          groupId: 1,
          status: "Member",
        },
        {
          userId: 3,
          groupId: 2,
          status: "Member",
        },
        {
          userId: 4,
          groupId: 2,
          status: "Member",
        },
        {
          userId: 5,
          groupId: 1,
          status: "Co-host",
        },
        {
          userId: 6,
          groupId: 1,
          status: "Member",
        },
        {
          userId: 6,
          groupId: 2,
          status: "Member",
        },
        {
          userId: 6,
          groupId: 3,
          status: "Member",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";

    return queryInterface.bulkDelete(options);
  },
};
