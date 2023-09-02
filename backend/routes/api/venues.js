const express = require("express");
const { Venue, User, Membership, Group } = require("../../db/models");

const { requireAuth } = require("../../utils/auth.js");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

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

//Edit a venue by its id
router.put("/:venueId", requireAuth, validateVenue, async (req, res) => {
  const venue = await Venue.findByPk(req.params.venueId);
  if (!venue) {
    res.status(404);
    return res.json({
      message: "Venue couldn't be found",
    });
  }
  const group = await Group.findByPk(venue.groupId);
  console.log(group);
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
    await venue.update({
      address,
      city,
      state,
      lat,
      lng,
      updatedAt: Date.now(),
    });
    return res.json({
      id: venue.id,
      groupId: venue.groupId,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      lat: venue.lat,
      lng: venue.lng,
    });
  }
});

module.exports = router;
