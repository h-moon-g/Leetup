import React from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Groups.css";

import { getGroups } from "../../store/groups";
import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";

function Groups() {
  const dispatch = useDispatch();

  const groups = useSelector((state) => {
    return state.groups.list.map((groupId) => state.groups[groupId]);
  });

  const events = useSelector((state) => {
    return state.events.list.map((eventId) => state.events[eventId]);
  });

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  return (
    <>
      <div>
        <NavLink to="/events">Events</NavLink>
        <h2>Groups</h2>
        <h2>Groups in Leetup</h2>
        {groups.map((group) => {
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
            <NavLink to={`/groups/${group.id}`}>
              <div>
                <h3>{group.name}</h3>
                <img src={group.previewImage} alt="leetup Img"></img>
                <ul>
                  <li>{group.about}</li>
                  <li>{location}</li>
                  <li>{groupPrivacy}</li>
                  <li>{numEvents}</li>
                </ul>
              </div>
            </NavLink>
          );
        })}
      </div>
    </>
  );
}

export default Groups;
