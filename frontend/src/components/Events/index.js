import React from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Events.css";

import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";

function Events() {
  const dispatch = useDispatch();

  const events = useSelector((state) => {
    return state.events.list.map((eventId) => state.events[eventId]);
  });

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  return (
    <>
      <div>
        <NavLink to="/groups">Groups</NavLink>
        <h2>Events</h2>
        <h2>Events in Leetup</h2>
        {events.map((event) => {
          return (
            <NavLink to={`/events/${event.id}`}>
              <div>
                <h3>{event.name}</h3>
                <ul>
                  <li>{event.type}</li>
                  <li>{event.startDate}</li>
                  <li>{event.endDate}</li>
                  <li>{event.numAttending}</li>
                  <li>{event.Group.name}</li>
                  <li>{event.Venue.id}</li>
                </ul>
              </div>
            </NavLink>
          );
        })}
      </div>
    </>
  );
}

export default Events;
