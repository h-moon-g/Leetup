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
          status: "host",
        },
        {
          userId: 1,
          groupId: 4,
          status: "host",
        },
        {
          userId: 2,
          groupId: 2,
          status: "host",
        },
        {
          userId: 3,
          groupId: 3,
          status: "host",
        },
        {
          userId: 2,
          groupId: 1,
          status: "pending",
        },
        {
          userId: 3,
          groupId: 2,
          status: "member",
        },
        {
          userId: 4,
          groupId: 2,
          status: "member",
        },
        {
          userId: 5,
          groupId: 1,
          status: "co-host",
        },
        {
          userId: 6,
          groupId: 1,
          status: "member",
        },
        {
          userId: 6,
          groupId: 2,
          status: "member",
        },
        {
          userId: 6,
          groupId: 3,
          status: "member",
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
