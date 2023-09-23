import React from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Events.css";

import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";

function Events() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const events = useSelector((state) => {
    return state.events.list.map((eventId) => state.events[eventId]);
  });

  let futureEvents = [];
  let pastEvents = [];
  {
    events.map((event) => {
      const today = new Date();
      const eventDate = new Date(event.startDate);
      if (eventDate < today) {
        pastEvents.unshift(event);
      } else {
        futureEvents.unshift(event);
      }
    });
  }
  futureEvents.sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });
  return (
    <>
      <div className="wrapper-div2">
        <div className="top-text2">
          <div className="events-groups-div2">
            <h2>Events</h2>
            <NavLink to="/groups">Groups</NavLink>
          </div>
          <h2>Events in Leetup</h2>
        </div>
        {futureEvents.map((event) => {
          const splitDate = event.startDate.split(" ");
          const newDate = splitDate[0] + " · " + splitDate[1];
          return (
            <div className="map-wrapper-div2">
              <NavLink to={`/events/${event.id}`} className="a-link2">
                <div className="no-desc-div2">
                  <div className="img-div2">
                    <img src={event.previewImage} alt="leetup Img"></img>
                  </div>
                  <div className="content-div2">
                    <h6>{newDate}</h6>
                    <h3>{event.name}</h3>
                    <h4>
                      {event.Venue.city}, {event.Venue.state}
                    </h4>
                  </div>
                </div>
                <div className="desc-div2">
                  <h5>{event.description}</h5>
                  <h5>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </h5>
                </div>
              </NavLink>
            </div>
          );
        })}
        {pastEvents.map((event) => {
          const splitDate = event.startDate.split(" ");
          const newDate = splitDate[0] + " · " + splitDate[1];
          return (
            <div className="map-wrapper-div2">
              <NavLink to={`/events/${event.id}`} className="a-link2">
                <div className="no-desc-div2">
                  <div className="img-div2">
                    <img src={event.previewImage} alt="leetup Img"></img>
                  </div>
                  <div className="content-div2">
                    <h6>{newDate}</h6>
                    <h3>{event.name}</h3>
                    <h4>
                      {event.Venue.city}, {event.Venue.state}
                    </h4>
                  </div>
                </div>
                <div className="desc-div2">
                  <h5>{event.description}</h5>
                  <h5>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </h5>
                </div>
              </NavLink>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Events;
