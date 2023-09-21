import React from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./GetOneGroup.css";

import { getOneGroup } from "../../store/oneGroup";
import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";

function Groups() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneGroup(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const group = useSelector((state) => state.group);

  console.log("here is group ==>" + group);

  const events = useSelector((state) => {
    return state.events.list.map((eventId) => state.events[eventId]);
  });

  if (!Object.values(group).length) {
    return null;
  }

  let previewImage;
  group.GroupImages.forEach((image) => {
    if (image.preview) {
      previewImage = image.url;
    }
  });
  let location = `${group.city}, ${group.state}`;
  let numEvents = 0;
  events.forEach((event) => {
    if (event.groupId === group.id) {
      numEvents++;
    }
  });
  let groupPrivacy;
  if (group.private === false) {
    groupPrivacy = "Public";
  } else {
    groupPrivacy = "Private";
  }
  return (
    <>
      <div>
        <NavLink to="/groups">Groups</NavLink>
        <h1>{group.name}</h1>
        <img src={previewImage} alt="preview Image"></img>
        <h3>{location}</h3>
        <h3>{numEvents} events</h3>
        <h3>{groupPrivacy}</h3>
        <h3>
          Organized by {group.Organizer.firstName} {group.Organizer.lastName}
        </h3>
        <button>Join this group</button>
      </div>
      <div>
        <h4>Organizer</h4>
        <h4>
          {group.Organizer.firstName} {group.Organizer.lastName}
        </h4>
        <h4>What we're about</h4>
        <h5>{group.about}</h5>
        <h5>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </h5>
      </div>
    </>
  );
}

export default Groups;
