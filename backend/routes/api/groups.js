const express = require("express");
const {
  Group,
  GroupImage,
  User,
  Venue,
  Membership,
  Event,
  EventImage,
  Attendance,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const membership = require("../../db/models/membership");

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

const validateEvent = [
  check("venueId").custom(async (venueId) => {
    const existingVenue = await Venue.findByPk(venueId);
    if (!existingVenue) {
      throw new Error("Venue does not exist");
    }
  }),
  check("name")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("capacity").isInt().withMessage("Capacity must be an integer"),
  check("price").isDecimal().withMessage("Price is invalid"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("startDate")
    .isAfter(Date(Date.now()))
    .withMessage("Start date must be in the future"),
  check("endDate").custom(async (endDate, { req }) => {
    let startDate = req.body.startDate;
    if (endDate < startDate) {
      throw new Error("End date is less than start date");
    }
  }),
  handleValidationErrors,
];

const formattedDate = (date) => {
  d = new Date(date);
  cd = (num) => num.toString().padStart(2, 0);
  return (
    d.getFullYear() +
    "-" +
    cd(d.getMonth() + 1) +
    "-" +
    cd(d.getDate()) +
    " " +
    cd(d.getHours()) +
    ":" +
    cd(d.getMinutes()) +
    ":" +
    cd(d.getSeconds())
  );
};

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
          user.Membership.status !== "host"
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
    status: "host",
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
        if (image.id !== newGroupImage.id) {
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
    if (user.id !== organizerId && membership.status !== "co-host") {
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
      if (user.id !== organizerId && membership.status !== "co-host") {
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
        if (user.Attendance.status === "attending") userCount++;
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
    event.startDate = formattedDate(event.startDate);
    event.endDate = formattedDate(event.endDate);
  }
  eventObject.Events = eventsList;
  return res.json(eventObject);
});

//Add an event to a Group based on the Group's id
router.post(
  "/:groupId/events",
  requireAuth,
  validateEvent,
  async (req, res) => {
    const group = await Group.findOne({
      where: {
        id: req.params.groupId,
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
      if (user.id !== organizerId && membership.status !== "co-host") {
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
      const {
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      } = req.body;
      const newEvent = await Event.create({
        groupId: group.id,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      });
      return res.json({
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: price.toFixed(2),
        description: newEvent.description,
        startDate: formattedDate(newEvent.startDate),
        endDate: formattedDate(newEvent.endDate),
      });
    }
  }
);

//Get members by groupid
router.get("/:groupId/members", async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  const membersObject = {};
  let membersList = [];
  const organizerId = group.organizerId;
  const user = await User.findByPk(req.user.id);
  const membership = await Membership.findOne({
    where: {
      groupId: group.id,
      userId: user.id,
    },
  });
  if (user.id === organizerId || membership.status === "co-host") {
    const memberships = await Membership.findAll({
      where: {
        groupId: group.id,
      },
    });
    for (let i = 0; i < memberships.length; i++) {
      let member = memberships[i];
      const user = await User.findOne({
        where: {
          id: member.userId,
        },
        attributes: ["id", "firstName", "lastName"],
      });
      userJSON = user.toJSON();
      userJSON.Membership = { status: member.status };
      membersList.push(userJSON);
    }
    membersObject.Members = membersList;
    return res.json(membersObject);
  } else {
    const memberships = await Membership.findAll({
      where: {
        groupId: group.id,
      },
    });
    for (let i = 0; i < memberships.length; i++) {
      let member = memberships[i];
      const user = await User.findOne({
        where: {
          id: member.userId,
        },
        attributes: ["id", "firstName", "lastName"],
      });
      userJSON = user.toJSON();
      userJSON.Membership = { status: member.status };
      if (member.status !== "pending") {
        membersList.push(userJSON);
      }
    }
    membersObject.Members = membersList;
    return res.json(membersObject);
  }
});

//Request a membership for a group
router.post("/:groupId/membership", requireAuth, async (req, res) => {
  const group = await Group.findOne({
    where: {
      id: req.params.groupId,
    },
  });
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  const user = await User.findByPk(req.user.id);
  const membership = await Membership.findOne({
    where: { userId: user.id, groupId: group.id },
  });
  if (membership) {
    if (membership.status !== "pending") {
      res.status(400);
      return res.json({ message: "User is already a member of the group" });
    } else {
      res.status(400);
      return res.json({ message: "Membership has already been requested" });
    }
  }
  const newMembership = await Membership.create({
    userId: user.id,
    groupId: group.id,
    status: "pending",
  });
  return res.json({
    memberId: newMembership.groupId,
    status: newMembership.status,
  });
});

//Edit status of membership
router.put("/:groupId/membership", requireAuth, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
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
    if (user.id === organizerId) {
      const { memberId, status } = req.body;
      if (status === "pending") {
        res.status(400);
        return res.json({
          message: "Validation Error",
          errors: {
            status: "Cannot change a membership status to pending",
          },
        });
      }
      const updatingUser = await User.findByPk(memberId);
      if (!updatingUser) {
        res.status(400);
        return res.json({
          message: "Validation Error",
          errors: {
            memberId: "User couldn't be found",
          },
        });
      }
      const updatingMem = await Membership.findOne({
        where: {
          groupId: group.id,
          userId: updatingUser.id,
        },
      });
      if (!updatingMem) {
        res.status(404);
        return res.json({
          message: "Membership between the user and the group does not exist",
        });
      }
      await updatingMem.update({
        status: status,
      });
      return res.json({
        id: updatingMem.id,
        groupId: updatingMem.groupId,
        memberId: updatingMem.userId,
        status: updatingMem.status,
      });
    } else if (membership.status === "co-host") {
      const { memberId, status } = req.body;
      if (status === "co-host") {
        res.status(403);
        return res.json({
          message: "Forbidden",
        });
      }
      if (status === "pending") {
        res.status(400);
        return res.json({
          message: "Validation Error",
          errors: {
            status: "Cannot change a membership status to pending",
          },
        });
      }
      const updatingUser = await User.findByPk(memberId);
      if (!updatingUser) {
        res.status(400);
        return res.json({
          message: "Validation Error",
          errors: {
            memberId: "User couldn't be found",
          },
        });
      }
      const updatingMem = await Membership.findOne({
        where: {
          groupId: group.id,
          userId: updatingUser.id,
        },
      });
      if (!updatingMem) {
        res.status(404);
        return res.json({
          message: "Membership between the user and the group does not exist",
        });
      }
      await updatingMem.update({
        status: status,
      });
      return res.json({
        id: updatingMem.id,
        groupId: updatingMem.groupId,
        memberId: updatingMem.userId,
        status: updatingMem.status,
      });
    } else {
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
    const { memberId, status } = req.body;
    if (status === "pending") {
      res.status(400);
      return res.json({
        message: "Validation Error",
        errors: {
          status: "Cannot change a membership status to pending",
        },
      });
    }
    const updatingUser = await User.findByPk(memberId);
    if (!updatingUser) {
      res.status(400);
      return res.json({
        message: "Validation Error",
        errors: {
          memberId: "User couldn't be found",
        },
      });
    }
    const updatingMem = await Membership.findOne({
      where: {
        groupId: group.id,
        userId: updatingUser.id,
      },
    });
    if (!updatingMem) {
      res.status(404);
      return res.json({
        message: "Membership between the user and the group does not exist",
      });
    }
    await updatingMem.update({
      status: status,
    });
    return res.json({
      id: updatingMem.id,
      groupId: updatingMem.groupId,
      memberId: updatingMem.userId,
      status: updatingMem.status,
    });
  }
});

//Delete a membership
router.delete("/:groupId/membership", requireAuth, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  const organizerId = group.organizerId;
  const user = await User.findByPk(req.user.id);
  const { memberId } = req.body;
  const updatingUser = await User.findByPk(memberId);
  if (!updatingUser) {
    res.status(400);
    return res.json({
      message: "Validation Error",
      errors: {
        memberId: "User couldn't be found",
      },
    });
  }
  if (user.id !== organizerId && user.id !== updatingUser.id) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  } else {
    const updatingMem = await Membership.findOne({
      where: {
        groupId: group.id,
        userId: updatingUser.id,
      },
    });
    if (!updatingMem) {
      res.status(404);
      return res.json({
        message: "Membership does not exist for this User",
      });
    }
    await updatingMem.destroy();
    return res.json({
      message: "Successfully deleted membership from group",
    });
  }
});

module.exports = router;
