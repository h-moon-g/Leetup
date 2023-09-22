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

  const user = useSelector((state) => state.session.user);

  const group = useSelector((state) => state.group);

  const events = useSelector((state) => {
    return state.events.list.map((eventId) => state.events[eventId]);
  });

  if (!Object.values(group).length) {
    return null;
  }
  let button;
  if (user.id === group.organizerId) {
    button = (
      <div>
        <button>Create event</button>
        <button>Update</button>
        <button>Delete</button>
      </div>
    );
  } else {
    button = (
      <div>
        <button>Join this group</button>
      </div>
    );
  }

  let previewImage;
  group.GroupImages.forEach((image) => {
    if (image.preview) {
      previewImage = image.url;
    }
  });
  let location = `${group.city}, ${group.state}`;
  let groupEvents = [];
  events.forEach((event) => {
    if (event.groupId === group.id) {
      groupEvents.push(event);
    }
  });
  let groupPrivacy;
  if (group.private === false) {
    groupPrivacy = "Public";
  } else {
    groupPrivacy = "Private";
  }
  let futureEvents = [];
  let pastEvents = [];
  const today = new Date();
  groupEvents.forEach((event) => {
    const eventDate = new Date(event.endDate);
    if (eventDate < today) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });
  let pastContent = null;
  let futureContent = null;
  if (pastEvents.length !== 0) {
    pastContent = (
      <div>
        <h2>Past Events {pastEvents.length}</h2>
        {pastEvents.map((event) => {
          return (
            <NavLink to={`/events/${event.id}`}>
              <div>
                <img src={event.previewImage} alt="preview Image"></img>;
                <h3>{event.startDate}</h3>
                <h3>{event.name}</h3>
                <h3>
                  {event.Venue.city}, {event.Venue.state}
                </h3>
                <h4>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </h4>
              </div>
            </NavLink>
          );
        })}
      </div>
    );
  }
  if (futureEvents.length !== 0) {
    futureContent = (
      <div>
        <h2>Upcoming Events {futureEvents.length}</h2>
        {futureEvents.map((event) => {
          return (
            <NavLink to={`/events/${event.id}`}>
              <div>
                <img src={event.previewImage} alt="preview Image"></img>;
                <h3>{event.startDate}</h3>
                <h3>{event.name}</h3>
                <h3>
                  {event.Venue.city}, {event.Venue.state}
                </h3>
                <h4>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </h4>
              </div>
            </NavLink>
          );
        })}
      </div>
    );
  }
  return (
    <>
      <div>
        <NavLink to="/groups">Groups</NavLink>
        <h1>{group.name}</h1>
        <img src={previewImage} alt="preview Image"></img>
        <h3>{location}</h3>
        <h3>{groupEvents.length} events</h3>
        <h3>{groupPrivacy}</h3>
        <h3>
          Organized by {group.Organizer.firstName} {group.Organizer.lastName}
        </h3>
        <div>{button}</div>
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
      <div>{futureContent}</div>
      <div>{pastContent}</div>
    </>
  );
}

export default Groups;
