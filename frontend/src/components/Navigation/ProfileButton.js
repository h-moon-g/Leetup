import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import "./ProfileButton.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  let arrow;
  if (showMenu) {
    arrow = <i class="fa-solid fa-angle-up"></i>;
  } else {
    arrow = <i class="fa-solid fa-angle-down"></i>;
  }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const history = useHistory();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push("/");
  };

  const getGroups = (e) => {
    e.preventDefault();
    setShowMenu(false);
    history.push("/groups");
  };

  const getEvents = (e) => {
    e.preventDefault();
    setShowMenu(false);
    history.push("/events");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={openMenu} id="user-button">
        <i className="fas fa-user-circle" />
      </button>
      <button onClick={openMenu} id="arrow-dropdown">
        {arrow}
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>Hello, {user.firstName}</li>
        <li id="email-li">{user.email}</li>
        <li>
          <button onClick={getGroups}>See all groups</button>
        </li>
        <li id="events-li">
          <button onClick={getEvents}>Find an event</button>
        </li>
        <li id="logout-li">
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
