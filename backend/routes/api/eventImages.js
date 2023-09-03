const express = require("express");
const {
  EventImage,
  User,
  Group,
  Membership,
  Event,
} = require("../../db/models");

const { requireAuth } = require("../../utils/auth.js");

const router = express.Router();

//Delete an image for an event
router.delete("/:imageId", requireAuth, async (req, res) => {
  const image = await EventImage.findByPk(req.params.imageId);
  if (!image) {
    res.status(404);
    return res.json({
      message: "Event Image couldn't be found",
    });
  }
  const event = await Event.findByPk(image.eventId);
  const group = await Group.findByPk(event.groupId);
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
