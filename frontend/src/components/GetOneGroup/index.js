import React from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./GetOneGroup.css";

import { getOneGroup } from "../../store/oneGroup";
import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";

function Groups() {
  const { groupId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneGroup(groupId));
  }, [dispatch, groupId]);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const group = useSelector((state) => {
    return state.group;
  });

  const events = useSelector((state) => {
    return state.events.list.map((eventId) => state.events[eventId]);
  });

  let previewImage;
  group.GroupImages.forEach((image) => {
    if (image.preview) {
      previewImage = image.url;
    }
  });
  let groupPrivacy;
  let numEvents = 0;
  let location = `${group.city}, ${group.state}`;
  events.forEach((event) => {
    if (event.groupId === group.id) {
      numEvents++;
    }
  });
  if (numEvents === 1) {
    numEvents = "1 event";
  } else {
    numEvents = `${numEvents} events`;
  }
  if (group.private === false) {
    groupPrivacy = "Public";
  } else {
    groupPrivacy = "Private";
  }

  return (
    <>
      <div>
        <NavLink to="/groups">Groups</NavLink>
        <div>
          <h1>{group.name}</h1>
          <img src={previewImage} alt="leetup Img"></img>
          <h3>{location}</h3>
          <h3>{groupPrivacy}</h3>
          <h3>{numEvents}</h3>
          <h3>
            Organized by {group.Organizer.firstName} {group.Organizer.lastName}
          </h3>
          <button>Join this Group</button>
        </div>
        <div>
          <h3>Organizer</h3>
          <h4>
            {" "}
            {group.Organizer.firstName} {group.Organizer.lastName}
          </h4>
          <h3>What we're about</h3>
          <h6>{group.about}</h6>
          <h6></h6>
        </div>
      </div>
    </>
  );
}

export default Groups;
