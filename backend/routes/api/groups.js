const express = require("express");
const {
  Group,
  GroupImage,
  User,
  Venue,
  Membership,
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

module.exports = router;
