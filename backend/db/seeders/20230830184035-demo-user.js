"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "Jane",
          lastName: "Love",
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Lorem",
          lastName: "Ipsum",
          email: "user1@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "John",
          lastName: "Doe",
          email: "user2@user.io",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Crazy",
          lastName: "Lady",
          email: "lady@user.io",
          username: "krazy",
          hashedPassword: bcrypt.hashSync("password4"),
        },
        {
          firstName: "Jeff",
          lastName: "Vine",
          email: "ripvine@user.io",
          username: "mynamejeff",
          hashedPassword: bcrypt.hashSync("password5"),
        },
        {
          firstName: "denji",
          lastName: "pochita",
          email: "csm@user.io",
          username: "kickback",
          hashedPassword: bcrypt.hashSync("password6"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.bulkDelete(options);
  },
};
