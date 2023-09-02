const express = require("express");
const {
  Group,
  GroupImage,
  User,
  Venue,
  Membership,
  Event,
  EventImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateCreateGroup = [
  check("name")
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private").isBoolean().withMessage("Private must be a boolean"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  handleValidationErrors,
];

const validateVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("lat").isDecimal().withMessage("Latitude is not valid"),
  check("lng").isDecimal().withMessage("Longitude is not valid"),
  handleValidationErrors,
];

const router = express.Router();

//Get all groups
router.get("", async (req, res) => {
  const groupObject = {};
  const groups = await Group.findAll({
    include: [
      {
        model: GroupImage,
      },
      {
        model: User,
      },
    ],
  });
  let groupsList = [];
  groups.forEach((group) => {
    groupsList.push(group.toJSON());
  });
  groupsList.forEach((group) => {
    let hasPreviewImage = false;
    let userCount = 0;
    if (!group.Users.length) {
      group.numMembers = 0;
      delete group.Users;
    } else {
      group.Users.forEach(() => {
        userCount++;
        group.numMembers = userCount;
        delete group.Users;
      });
    }
    if (!group.GroupImages.length) {
      group.previewImage = "No preview image.";
      delete group.GroupImages;
    } else {
      group.GroupImages.forEach((image) => {
        if (image.preview === true) {
          group.previewImage = image.url;
          hasPreviewImage = true;
        }
      });
      if (hasPreviewImage === false) {
        group.previewImage = "No preview image.";
      }
      delete group.GroupImages;
    }
  });
  groupObject.Groups = groupsList;
  return res.json(groupObject);
});

// Get all groups joined/organized by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const groupObject = {};
  const groups = await Group.findAll({
    include: [
      {
        model: GroupImage,
      },
      {
        model: User,
      },
    ],
  });
  let groupsList = [];
  let currentGroupsList = [];
  groups.forEach((group) => {
    groupsList.push(group.toJSON());
  });
  groupsList.forEach((group) => {
    let hasPreviewImage = false;
    let userCount = 0;
    if (!group.Users.length) {
      group.numMembers = 0;
    } else {
      group.Users.forEach(() => {
        userCount++;
        group.numMembers = userCount;
      });
    }
    if (!group.GroupImages.length) {
      group.previewImage = "No preview image.";
      delete group.GroupImages;
    } else {
      group.GroupImages.forEach((image) => {
        if (image.preview === true) {
          group.previewImage = image.url;
          hasPreviewImage = true;
        }
      });
      if (hasPreviewImage === false) {
        group.previewImage = "No preview image.";
      }
      delete group.GroupImages;
    }
    if (group.organizerId === req.user.id) {
      currentGroupsList.push(group);
    }
    if (group.Users.length) {
      group.Users.forEach((user) => {
        if (
          user.Membership.userId === req.user.id &&
          user.Membership.status !== "Host"
        ) {
          currentGroupsList.push(group);
        }
      });
    }
    group.Users.forEach(() => {
      delete group.Users;
    });
  });
  groupObject.Groups = currentGroupsList;
  return res.json(groupObject);
});

//Get details of a Group from an id
router.get("/:groupId", async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId,
    },
    include: [
      {
        model: User,
      },
      {
        model: GroupImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: Venue,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    ],
  });
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  let groupJSON = group.toJSON();
  const organizer = await User.findByPk(groupJSON.organizerId, {
    attributes: ["id", "firstName", "lastName"],
  });
  groupJSON.Organizer = organizer;
  let userCount = 0;
  if (!groupJSON.Users.length) {
    groupJSON.numMembers = 0;
    delete groupJSON.Users;
  } else {
    groupJSON.Users.forEach(() => {
      userCount++;
      groupJSON.numMembers = userCount;
      delete groupJSON.Users;
    });
  }
  return res.json(groupJSON);
});

//Create a group
router.post("", requireAuth, validateCreateGroup, async (req, res) => {
  const { name, about, type, private, city, state } = req.body;
  const organizer = await User.findByPk(req.user.id);
  const newGroup = await Group.create({
    organizerId: organizer.id,
    name,
    about,
    type,
    private,
    city,
    state,
  });
  await Membership.create({
    userId: organizer.id,
    groupId: newGroup.id,
    status: "Host",
  });
  return res.json(newGroup);
});

//Add an image to a Group based on the Group's id
router.post("/:groupId/images", requireAuth, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId,
    },
    include: {
      model: GroupImage,
    },
  });
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  const organizerId = group.organizerId;
  const user = await User.findByPk(req.user.id);
  if (user.id !== organizerId) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  } else {
    const { url, preview } = req.body;
    const newGroupImage = await GroupImage.create({
      groupId: group.id,
      url,
      preview,
    });
    if (newGroupImage.preview === true) {
      for (let i = 0; i < group.GroupImages.length; i++) {
        let image = group.GroupImages[i];
        if (image.url !== newGroupImage.url) {
          await image.update({
            preview: false,
          });
        }
      }
    }
    return res.json({
      id: newGroupImage.id,
      url: newGroupImage.url,
      preview: newGroupImage.preview,
    });
  }
});

//Edit a group
router.put("/:groupId", requireAuth, validateCreateGroup, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  const organizerId = group.organizerId;
  const user = await User.findByPk(req.user.id);
  if (user.id !== organizerId) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  } else {
    const { name, about, type, private, city, state } = req.body;
    await group.update({
      name,
      about,
      type,
      private,
      city,
      state,
      updatedAt: Date.now(),
    });
    return res.json(group);
  }
});

//Delete a group
router.delete("/:groupId", requireAuth, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  const organizerId = group.organizerId;
  const user = await User.findByPk(req.user.id);
  if (user.id !== organizerId) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  } else {
    await group.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }
});

//Get all Venues for a Group specified by its id
router.get("/:groupId/venues", requireAuth, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId,
    },
    include: {
      model: Venue,
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    },
  });
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  const organizerId = group.organizerId;
  const user = await User.findByPk(req.user.id);
  const membership = await Membership.findOne({
    where: {
      groupId: group.id,
      userId: user.id,
    },
  });
  if (membership) {
    if (user.id !== organizerId && membership.status !== "Co-host") {
      res.status(403);
      return res.json({
        message: "Forbidden",
      });
    }
  }
  if (!membership) {
    if (user.id !== organizerId) {
      res.status(403);
      return res.json({
        message: "Forbidden",
      });
    }
  } else {
    const venuesObj = {};
    venuesObj.Venues = group.Venues;
    return res.json(venuesObj);
  }
});

//Add a venue to a Group based on the Group's id
router.post(
  "/:groupId/venues",
  requireAuth,
  validateVenue,
  async (req, res) => {
    const group = await Group.findOne({
      where: {
        id: req.params.groupId,
      },
      include: {
        model: Venue,
      },
    });
    if (!group) {
      res.status(404);
      return res.json({
        message: "Group couldn't be found",
      });
    }
    const organizerId = group.organizerId;
    const user = await User.findByPk(req.user.id);
    const membership = await Membership.findOne({
      where: {
        groupId: group.id,
        userId: user.id,
      },
    });
    if (membership) {
      if (user.id !== organizerId && membership.status !== "Co-host") {
        res.status(403);
        return res.json({
          message: "Forbidden",
        });
      }
    }
    if (!membership) {
      if (user.id !== organizerId) {
        res.status(403);
        return res.json({
          message: "Forbidden",
        });
      }
    } else {
      const { address, city, state, lat, lng } = req.body;
      const newVenue = await Venue.create({
        groupId: group.id,
        address,
        city,
        state,
        lat,
        lng,
      });
      return res.json({
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: newVenue.lat,
        lng: newVenue.lng,
      });
    }
  }
);

//Get all Events of a Group specified by its id
router.get("/:groupId/events", async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId,
    },
    attributes: ["id", "name", "city", "state"],
  });
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  const eventObject = {};
  const events = await Event.findAll({
    where: {
      groupId: group.id,
    },
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
