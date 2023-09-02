const express = require("express");
const { Event, EventImage, User, Group, Venue } = require("../../db/models");

const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

//Get all events
router.get("", async (req, res) => {
  const eventObject = {};
  const events = await Event.findAll({
    attributes: {
      exclude: ["description", "capacity", "price", "createdAt", "updatedAt"],
    },
    include: [
      {
        model: EventImage,
      },
      {
        model: User,
      },
    ],
  });
  let eventsList = [];
  events.forEach((event) => {
    eventsList.push(event.toJSON());
  });
  for (let i = 0; i < eventsList.length; i++) {
    let event = eventsList[i];
    let hasPreviewImage = false;
    let userCount = 0;
    if (!event.Users.length) {
      event.numAttending = 0;
      delete event.Users;
    } else {
      event.Users.forEach(() => {
        userCount++;
        event.numAttending = userCount;
        delete event.Users;
      });
    }
    if (!event.EventImages.length) {
      event.previewImage = "No preview image.";
      delete event.EventImages;
    } else {
      event.EventImages.forEach((image) => {
        if (image.preview === true) {
          event.previewImage = image.url;
          hasPreviewImage = true;
        }
      });
      if (hasPreviewImage === false) {
        event.previewImage = "No preview image.";
      }
      delete event.EventImages;
    }
    const group = await Group.findOne({
      where: {
        id: event.groupId,
      },
      attributes: ["id", "name", "city", "state"],
    });
    event.Group = group;
    const venue = await Venue.findOne({
      where: {
        id: event.venueId,
      },
      attributes: ["id", "city", "state"],
    });
    event.Venue = venue;
  }
  eventObject.Events = eventsList;
  return res.json(eventObject);
});

module.exports = router;
