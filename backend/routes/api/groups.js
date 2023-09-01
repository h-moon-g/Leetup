const express = require("express");
const { Group, GroupImage, User } = require("../../db/models");
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
    console.log(group.Users);
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
    group.GroupImages.forEach((groupImage) => {
      if (groupImage.url) {
        group.previewImage = groupImage.url;
      } else {
        group.previewImage = "No preview image.";
      }
      delete group.GroupImages;
    });
  });
  groupObject.Groups = groupsList;
  return res.json(groupObject);
});

module.exports = router;

//   console.log(Object.getOwnPropertyNames(Group.prototype));
