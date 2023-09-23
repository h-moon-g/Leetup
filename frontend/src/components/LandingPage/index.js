import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import "./LandingPage.css";

function LandingPage() {
  const session = useSelector((state) => {
    return state.session;
  });
  let jlButton = null;
  let sangLink = null;
  if (!session.user) {
    jlButton = (
      <OpenModalButton
        buttonText="Join Leetup"
        modalComponent={<SignupFormModal />}
      />
    );
    sangLink = <h5>Start a new group</h5>;
  } else {
    sangLink = (
      <NavLink id="sangLinkGo" to="/groups/new">
        Start a new group
      </NavLink>
    );
  }
  return (
    <>
      <div id="lp">
        <div id="lp-top-div">
          <div id="lp-top-txt-div">
            <h1 className="lp-h1">The people platform-</h1>
            <h1 className="lp-h1">Where interests</h1>
            <h1 className="lp-h1">become friendships</h1>
            <p className="lp-p-filler">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div id="lp-top-img-div">
            <img
              src="https://cdn.discordapp.com/attachments/324927814270713866/1155965761295224842/image.png"
              alt="leetup Img 1"
              className="lp-img-1"
            ></img>
          </div>
        </div>
        <div id="hlw-div">
          <h3 className="lp-h3">How Leetup Works</h3>
          <div id="hlw-p-div">
            <p className="lp-p-filler">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
        <div id="bottom-div">
          <div className="lp-sec">
            <img
              src="https://cdn.discordapp.com/attachments/324927814270713866/1155965894833479691/image.png"
              alt="leetup Img 2"
            ></img>
            <NavLink to="/groups">See all groups</NavLink>
            <p className="lp-p-filler">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor.
            </p>
          </div>
          <div className="lp-sec">
            <img
              src="https://cdn.discordapp.com/attachments/324927814270713866/1155965944959615056/image.png"
              alt="leetup Img 3"
            ></img>
            <NavLink to="/events">Find an event</NavLink>
            <p className="lp-p-filler">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor.
            </p>
          </div>
          <div className="lp-sec">
            <img
              src="https://cdn.discordapp.com/attachments/324927814270713866/1155966097267367946/image.png"
              alt="leetup Img 4"
            ></img>
            <div>{sangLink}</div>
            <p className="lp-p-filler">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor.
            </p>
          </div>
        </div>
        <div id="lp-button">{jlButton}</div>
      </div>
    </>
  );
}

export default LandingPage;
