const express = require("express");
const {
  Event,
  EventImage,
  User,
  Group,
  Venue,
  Attendance,
  Membership,
} = require("../../db/models");

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
      event.Users.forEach((user) => {
        if (user.Attendance.status === "Attending") userCount++;
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
    event.startDate = event.startDate.split;
  }
  eventObject.Events = eventsList;
  return res.json(eventObject);
});

//Get details of an Event from an id
router.get("/:eventId", async (req, res) => {
  const event = await Event.findOne({
    where: {
      id: req.params.eventId,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: [
      {
        model: EventImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
      },
    ],
  });
  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found",
    });
  }
  let eventJSON = event.toJSON();
  let userCount = 0;
  if (!eventJSON.Users.length) {
    eventJSON.numAttending = 0;
    delete eventJSON.Users;
  } else {
    eventJSON.Users.forEach((user) => {
      if (user.Attendance.status === "Attending") userCount++;
      eventJSON.numAttending = userCount;
      delete eventJSON.Users;
    });
  }
  const group = await Group.findByPk(eventJSON.groupId, {
    attributes: ["id", "name", "private", "city", "state"],
  });
  eventJSON.Group = group;
  const venue = await Venue.findByPk(eventJSON.venueId, {
    attributes: {
      exclude: ["groupId", "createdAt", "updatedAt"],
    },
  });
  eventJSON.Venue = venue;
  return res.json(eventJSON);
});

//Add an image to a Group based on the Group's id
router.post("/:eventId/images", requireAuth, async (req, res) => {
  const event = await Event.findOne({
    where: {
      id: req.params.eventId,
    },
    include: {
      model: EventImage,
    },
  });
  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found",
    });
  }
  const user = await User.findByPk(req.user.id);
  const attendance = await Attendance.findOne({
    where: {
      eventId: event.id,
      userId: user.id,
    },
  });
  const membership = await Membership.findOne({
    where: {
      userId: user.id,
      groupId: event.groupId,
    },
  });
  let validUser = false;
  if (attendance || membership) {
    if (attendance) {
      console.log(attendance.status);
      if (attendance.status === "Attending") {
        validUser = true;
      }
    }
    if (membership) {
      console.log(membership.status);
      if (membership.status === "Host" || membership.status === "Co-host") {
        validUser = true;
      }
    }
  }
  if (validUser === false) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  } else {
    const { url, preview } = req.body;
    const newEventImage = await EventImage.create({
      eventId: event.id,
      url,
      preview,
    });
    if (newEventImage.preview === true) {
      console.log(event.EventImages);
      for (let i = 0; i < event.EventImages.length; i++) {
        let image = event.EventImages[i];
        if (image.id !== newEventImage.id) {
          await image.update({
            preview: false,
          });
        }
      }
    }
    return res.json({
      id: newEventImage.id,
      url: newEventImage.url,
      preview: newEventImage.preview,
    });
  }
});

module.exports = router;
