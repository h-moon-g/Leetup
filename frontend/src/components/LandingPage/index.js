import React from "react";
import { NavLink } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  return (
    <>
      <div>
        <h1 className="lp-h1">The people platform-</h1>
        <h1 className="lp-h1">Where interests</h1>
        <h1 className="lp-h1">become friendships</h1>
        <p className="lp-p-filler">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <img
          src="https://cdn.discordapp.com/attachments/324927814270713866/1155965761295224842/image.png"
          alt="leetup Img 1"
        ></img>
      </div>
      <div>
        <h3 className="lp-h3">How Leetup Works</h3>
        <p className="lp-p-filler">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div>
        <img
          src="https://cdn.discordapp.com/attachments/324927814270713866/1155965894833479691/image.png"
          alt="leetup Img 2"
        ></img>
        <NavLink to="/groups">See all groups</NavLink>
        <p className="lp-p-filler">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <img
          src="https://cdn.discordapp.com/attachments/324927814270713866/1155965944959615056/image.png"
          alt="leetup Img 3"
        ></img>
        <NavLink to="/events">Find an event</NavLink>
        <p className="lp-p-filler">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <img
          src="https://cdn.discordapp.com/attachments/324927814270713866/1155966097267367946/image.png"
          alt="leetup Img 4"
        ></img>
        <a href="">Start a new group</a>
        <p className="lp-p-filler">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <button>Join Leetup</button>
    </>
  );
}

export default LandingPage;
