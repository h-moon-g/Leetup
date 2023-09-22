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
                <img src={event.previewImage} alt="leetup Img"></img>
                <h3>{event.startDate}</h3>
                <h2>{event.name}</h2>
                <h3>{event.type}</h3>
                <h3>
                  {event.Venue.city} {event.Venue.state}
                </h3>
                <h3>{event.description}</h3>
              </div>
            </NavLink>
          );
        })}
      </div>
    </>
  );
}

export default Events;
