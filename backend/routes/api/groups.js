const express = require("express");
const { Group, GroupImage, User } = require("../../db/models");
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
      group.GroupImages.forEach((groupImage) => {
        group.previewImage = groupImage.url;
        delete group.GroupImages;
      });
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
      group.GroupImages.forEach((groupImage) => {
        group.previewImage = groupImage.url;
        delete group.GroupImages;
      });
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

module.exports = router;
