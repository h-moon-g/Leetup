const express = require("express");
const { GroupImage, User, Group, Membership } = require("../../db/models");

const { requireAuth } = require("../../utils/auth.js");

const router = express.Router();

//Delete an image for a group
router.delete("/:imageId", requireAuth, async (req, res) => {
  const image = await GroupImage.findByPk(req.params.imageId);
  if (!image) {
    res.status(404);
    return res.json({
      message: "Group Image couldn't be found",
    });
  }
  const group = await Group.findByPk(image.groupId);
  const organizerId = group.organizerId;
  const user = await User.findByPk(req.user.id);
  const membership = await Membership.findOne({
    where: {
      userId: user.id,
      groupId: group.id,
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
    await image.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }
});

module.exports = router;
