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

  const groupId = event.Group?.id;

  useEffect(() => {
    dispatch(getOneGroup(groupId));
  }, [dispatch, groupId]);

  const group = useSelector((state) => state.group);

  const user = useSelector((state) => state.session.user);

  if (!Object.values(event).length) {
    return null;
  }

  if (!Object.values(group).length) {
    return null;
  }

  let button;
  if (user) {
    if (user.id === group.organizerId) {
      button = (
        <div id="e-id-delete-button-div">
          <OpenModalButton
            buttonText="Delete"
            modalComponent={<DeleteEventModal />}
          />
        </div>
      );
    } else {
      button = null;
    }
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
  let arrowString = "< ";
  const splitStartDate = event.startDate.split(" ");
  const newStartDate = splitStartDate[0] + " · " + splitStartDate[1];
  const splitEndDate = event.endDate.split(" ");
  const newEndDate = splitEndDate[0] + " · " + splitEndDate[1];
  return (
    <>
      <div id="e-id-top-div">
        <div id="e-id-breadcrumb">
          <h4>
            {arrowString}
            <NavLink to="/events" id="e-id-nav">
              Events
            </NavLink>
          </h4>
        </div>
        <h2>{event.name}</h2>
        <h3>
          Hosted by: {group.Organizer.firstName} {group.Organizer.lastName}
        </h3>
      </div>
      <div id="e-id-bottom-div">
        <div id="e-id-content-div">
          <div id="e-id-img-div">
            <img src={eventPreviewImage} alt="preview Image"></img>
          </div>
          <div id="e-id-side-info">
            <div id="e-id-group-div">
              <NavLink to={`/groups/${group.id}`} id="e-id-group-nav">
                <img src={groupPreviewImage} alt="preview Image"></img>
                <div id="e-id-group-info-txt">
                  <h2>{group.name}</h2>
                  <h3>{groupPrivacy}</h3>
                </div>
              </NavLink>
            </div>
            <div id="e-id-event-info">
              <div id="e-id-time">
                <i className="fa-regular fa-clock"></i>
                <div id="e-id-time-info">
                  <div id="e-id-start">
                    <h3>START</h3>
                    <h3 id="startTime">{newStartDate}</h3>
                  </div>
                  <div id="e-id-end">
                    <h3>END</h3>
                    <h3 id="filler">l</h3>
                    <h3 id="endTime">{newEndDate}</h3>
                  </div>
                </div>
              </div>
              <div id="e-id-price">
                <i className="fa-solid fa-dollar-sign"></i>
                <h3>{eventPrice}</h3>
              </div>
              <div id="e-id-place">
                <i className="fa-solid fa-map-pin"></i>
                <h3>{event.type}</h3>
                <div>{button}</div>
              </div>
            </div>
          </div>
        </div>
        <div id="e-id-details-div">
          <h2>Description</h2>
          <h4>{event.description}</h4>
          <h4>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </h4>
          <h4>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </h4>
        </div>
      </div>
    </>
  );
}

export default Events;
