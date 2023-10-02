import React from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Groups.css";

import { getGroups } from "../../store/groups";
import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";

function Groups() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const groups = useSelector((state) => {
    return state.groups.list.map((groupId) => state.groups[groupId]);
  });

  const events = useSelector((state) => {
    return state.events.list.map((eventId) => state.events[eventId]);
  });

  return (
    <>
      <div className="wrapper-div">
        <div id="top-text">
          <div id="events-groups-div">
            <NavLink to="/events">Events</NavLink>
            <h2>Groups</h2>
          </div>
          <h2>Groups in Leetup</h2>
        </div>
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
            <div className="map-wrapper-div">
              <NavLink to={`/groups/${group.id}`} id="a-link">
                <div id="img-div">
                  <img src={group.previewImage} alt="leetup Img"></img>
                </div>
                <div id="content-div">
                  <h3>{group.name}</h3>
                  <h4>{location}</h4>
                  <h5>{group.about}</h5>
                  <h4>
                    {numEvents} · {groupPrivacy}
                  </h4>
                </div>
              </NavLink>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Groups;
