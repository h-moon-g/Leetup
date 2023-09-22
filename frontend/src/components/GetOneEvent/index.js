import React from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./GetOneEvent.css";

import { getOneGroup } from "../../store/oneGroup";
import { getOneEvent } from "../../store/oneEvent";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import DeleteEventModal from "../DeleteEventModal";

function Events() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneEvent(id));
  }, [dispatch, id]);

  const event = useSelector((state) => state.event);

  const user = useSelector((state) => state.session.user);

  const groupId = event.Group?.id;

  useEffect(() => {
    dispatch(getOneGroup(groupId));
  }, [dispatch, groupId]);

  const group = useSelector((state) => state.group);

  if (!Object.values(event).length) {
    return null;
  }

  if (!Object.values(group).length) {
    return null;
  }

  let button;
  if (user.id === group.organizerId) {
    button = (
      <div>
        <OpenModalButton
          buttonText="Delete"
          modalComponent={<DeleteEventModal />}
        />
      </div>
    );
  } else {
    button = null;
  }

  let eventPreviewImage;
  event.EventImages.forEach((image) => {
    if (image.preview) {
      eventPreviewImage = image.url;
    }
  });
  let groupPreviewImage;
  group.GroupImages.forEach((image) => {
    if (image.preview) {
      groupPreviewImage = image.url;
    }
  });
  let groupPrivacy;
  if (group.private === false) {
    groupPrivacy = "Public";
  } else {
    groupPrivacy = "Private";
  }
  let eventPrice;
  if (event.price === "0.00") {
    eventPrice = "FREE";
  } else {
    eventPrice = event.price;
  }
  return (
    <>
      <div>
        <NavLink to="/events">Events</NavLink>
        <h1>{event.name}</h1>
        <h3>
          Hosted by {group.Organizer.firstName} {group.Organizer.lastName}
        </h3>
      </div>
      <div>
        <img src={eventPreviewImage} alt="preview Image"></img>;
      </div>
      <div>
        <img src={groupPreviewImage} alt="preview Image"></img>;
        <h3>{groupPrivacy}</h3>
      </div>
      <div>
        <div>
          <i class="fa-regular fa-clock"></i>
          <h3>START {event.startDate}</h3>
          <h3>END {event.endDate}</h3>
        </div>
        <div>
          <i class="fa-solid fa-dollar-sign"></i>
          <h3>{eventPrice}</h3>
        </div>
        <div>
          <i class="fa-solid fa-map-pin"></i>
          <h3>{event.type}</h3>
        </div>
        <div>{button}</div>
        <div>
          <h3>Details</h3>
          <h5>{event.description}</h5>
          <h5>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </h5>
        </div>
      </div>
    </>
  );
}

export default Events;
