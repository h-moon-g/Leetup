import React from "react";
import { useEffect } from "react";
import { NavLink, useParams, Redirect, useHistory } from "react-router-dom";
import "./GetOneGroup.css";

import { getOneGroup } from "../../store/oneGroup";
import { getEvents } from "../../store/events";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import DeleteGroupModal from "../DeleteGroupModal";

function Groups() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOneGroup(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  const user = useSelector((state) => state.session.user);

  const group = useSelector((state) => state.group);

  const events = useSelector((state) => {
    return state.events.list.map((eventId) => state.events[eventId]);
  });

  let history = useHistory();

  let createGroupButton = (e) => {
    e.preventDefault();
    history.push(`/groups/${group.id}/events/new`);
  };

  let updateButton = (e) => {
    e.preventDefault();
    history.push(`/groups/${group.id}/edit`);
  };

  if (!Object.values(group).length) {
    return null;
  }

  let comingSoonAlert = () => {
    alert("Feature coming soon...");
  };

  let button;
  if (user) {
    if (user.id === group.organizerId) {
      button = (
        <div id="action-buttons-div">
          <button onClick={createGroupButton}>Create event</button>
          <button onClick={updateButton}>Update</button>
          <OpenModalButton
            buttonText="Delete"
            modalComponent={<DeleteGroupModal />}
          />
        </div>
      );
    } else {
      button = (
        <div id="jtg-div">
          <button id="jtg-button" onClick={comingSoonAlert}>
            Join this group
          </button>
        </div>
      );
    }
  } else {
    button = null;
  }

  let previewImage;
  group.GroupImages.forEach((image) => {
    if (image.preview) {
      previewImage = image.url;
    }
  });
  let location = `${group.city}, ${group.state}`;
  let groupEvents = [];
  events.forEach((event) => {
    if (event.groupId === group.id) {
      groupEvents.push(event);
    }
  });
  let groupPrivacy;
  if (group.private === false) {
    groupPrivacy = "Public";
  } else {
    groupPrivacy = "Private";
  }
  let futureEvents = [];
  let pastEvents = [];
  const today = new Date();
  groupEvents.forEach((event) => {
    const eventDate = new Date(event.endDate);
    if (eventDate < today) {
      pastEvents.push(event);
    } else {
      futureEvents.push(event);
    }
  });
  futureEvents.sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });
  let pastContent = null;
  let futureContent = null;
  if (pastEvents.length !== 0) {
    pastContent = (
      <div>
        <h2>Past Events ({pastEvents.length})</h2>
        {pastEvents.map((event) => {
          const splitDate = event.startDate.split(" ");
          const newDate = splitDate[0] + " · " + splitDate[1];
          return (
            <div className="map-wrapper-div3">
              <NavLink to={`/events/${event.id}`} className="a-link3">
                <div className="no-desc-div3">
                  <div className="img-div3">
                    <img src={event.previewImage} alt="leetup Img"></img>
                  </div>
                  <div className="content-div3">
                    <h6>{newDate}</h6>
                    <h3>{event.name}</h3>
                    <h4>
                      {event.Venue.city}, {event.Venue.state}
                    </h4>
                  </div>
                </div>
                <div className="desc-div3">
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
    );
  }
  if (futureEvents.length !== 0) {
    futureContent = (
      <div>
        <h2>Upcoming Events ({futureEvents.length})</h2>
        {futureEvents.map((event) => {
          const splitDate = event.startDate.split(" ");
          const newDate = splitDate[0] + " · " + splitDate[1];
          return (
            <div className="map-wrapper-div3">
              <NavLink to={`/events/${event.id}`} className="a-link3">
                <div className="no-desc-div3">
                  <div className="img-div3">
                    <img src={event.previewImage} alt="leetup Img"></img>
                  </div>
                  <div className="content-div3">
                    <h6>{newDate}</h6>
                    <h3>{event.name}</h3>
                    <h4>
                      {event.Venue.city}, {event.Venue.state}
                    </h4>
                  </div>
                </div>
                <div className="desc-div3">
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
    );
  }
  let arrowString = "< ";
  if (!pastContent && !futureContent) {
    pastContent = (
      <div>
        <h2 id="nue-div">No Upcoming Events</h2>
      </div>
    );
  }
  return (
    <>
      <div id="g-id-top-div">
        <div id="g-id-breadcrumb">
          <h4>
            {arrowString}
            <NavLink to="/groups" id="g-id-nav">
              Groups
            </NavLink>
          </h4>
        </div>
        <div id="g-id-content-div">
          <div id="g-id-img-div">
            <img src={previewImage} alt="preview Image"></img>
          </div>
          <div id="g-id-info-div">
            <h1>{group.name}</h1>
            <h4>{location}</h4>
            <h4>
              {groupEvents.length} events · {groupPrivacy}
            </h4>
            <h4>
              Organized by: {group.Organizer.firstName}{" "}
              {group.Organizer.lastName}
            </h4>
            <div>{button}</div>
          </div>
        </div>
      </div>
      <div id="g-id-bottom-div">
        <h2 id="organize-title-txt">Organizer</h2>
        <h4 id="organizer-txt">
          {group.Organizer.firstName} {group.Organizer.lastName}
        </h4>
        <h2>What we're about</h2>
        <h5 id="about-txt">{group.about}</h5>
        <h5>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </h5>
        <h2 id="events-txt">
          Events({futureEvents.length + pastEvents.length})
        </h2>
        <div>{futureContent}</div>
        <div>{pastContent}</div>
      </div>
    </>
  );
}

export default Groups;
