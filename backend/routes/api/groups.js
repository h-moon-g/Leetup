const express = require("express");
const { Group, GroupImage, User, Venue } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");
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
  const previewImage = await GroupImage.findByPk(1);
  let groupsList = [];
  groups.forEach((group) => {
    groupsList.push(group.toJSON());
  });
  groupsList.forEach((group) => {
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
      group.previewImage = previewImage.url;
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
  const previewImage = await GroupImage.findByPk(1);
  let groupsList = [];
  let currentGroupsList = [];
  groups.forEach((group) => {
    groupsList.push(group.toJSON());
  });
  groupsList.forEach((group) => {
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
      group.previewImage = previewImage.url;
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

module.exports = router;
