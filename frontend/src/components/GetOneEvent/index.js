import React from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./GetOneEvent.css";

import { getOneEvent } from "../../store/oneEvent";
import { useDispatch, useSelector } from "react-redux";

function Events() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneEvent(id));
  }, [dispatch, id]);

  const event = useSelector((state) => state.event);

  return (
    <>
      <div>
        <NavLink to="/events">Events</NavLink>
        <h1>{event.name}</h1>
      </div>
    </>
  );
}

export default Events;
