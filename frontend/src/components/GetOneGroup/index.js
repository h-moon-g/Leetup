import React from "react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./GetOneGroup.css";

import { getOneGroup } from "../../store/oneGroup";
import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";

function Groups() {
  const { groupId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneGroup(groupId));
  }, [dispatch, groupId]);

  return (
    <>
      <div>
        <h2>Current Group</h2>
      </div>
    </>
  );
}

export default Groups;
