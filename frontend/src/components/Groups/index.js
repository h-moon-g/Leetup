import React from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Groups.css";

import { getGroups } from "../../store/groups";
import { useDispatch, useSelector } from "react-redux";

function Groups() {
  const dispatch = useDispatch();

  const groups = useSelector((state) => {
    return state.groups.list.map((groupId) => state.groups[groupId]);
  });

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  return (
    <>
      <div>
        <NavLink to="/events">Events</NavLink>
        <h2>Groups</h2>
        <h2>Groups in Leetup</h2>
        {groups.map((group) => {
          return (
            <div>
              <h3>{group.name}</h3>
              <ul>
                <li>{group.about}</li>
                <li>{group.type}</li>
                <li>{group.city}</li>
                <li>{group.state}</li>
                <li>{group.numMembers}</li>
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Groups;
