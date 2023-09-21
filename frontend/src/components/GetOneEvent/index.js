import React from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./GetOneEvent.css";

// import { getOneGroup } from "../../store/oneGroup";
import { getOneEvent } from "../../store/oneEvent";
import { useDispatch, useSelector } from "react-redux";

function Events() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneEvent(id));
  }, [dispatch, id]);

  const event = useSelector((state) => state.event);

  //   const groupId = event.Group.id;

  //   useEffect(() => {
  //     dispatch(getOneGroup(id));
  //   }, [dispatch, id]);

  //   const group = useSelector((state) => state.group);

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
