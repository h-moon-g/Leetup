import React from "react";
import { NavLink } from "react-router-dom";
import "./Groups.css";

function Groups() {
  return (
    <>
      <div>
        <NavLink to="/events">Events</NavLink>
        <h3>Groups</h3>
        <h3>Groups in Meetup</h3>
      </div>
    </>
  );
}

export default Groups;
