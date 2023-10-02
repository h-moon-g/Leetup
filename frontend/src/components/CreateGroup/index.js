import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { createGroup, deleteGroup } from "../../store/oneGroup";
import { createImg } from "../../store/oneGroup";
import "./CreateGroup.css";

function CreateGroup() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [imgErrors, setImgErrors] = useState({});

  const history = useHistory();

  const validateImg = () => {
    if (!url) {
      setImgErrors({ url: "Image URL required" });
      return false;
    }
    if (
      url &&
      !url.endsWith(".png") &&
      !url.endsWith(".jpg") &&
      !url.endsWith(".jpeg")
    ) {
      setImgErrors({ url: "Image URL must end in .png, .jpg, or .jpeg" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let createdGroup = await dispatch(
      createGroup({
        name,
        about,
        type,
        privacy,
        city,
        state,
      })
    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
    const validated = validateImg();
    if (createdGroup && validated) {
      await dispatch(
        createImg({
          id: createdGroup.id,
          url,
        })
      ).catch(async (res) => {
        await res.json();
      });
      history.push(`/groups/${createdGroup.id}`);
    } else {
      if (createdGroup) {
        dispatch(deleteGroup(createdGroup.id));
      }
    }
  };

  return (
    <>
      <div id="cg-div">
        <div id="cg-header-div">
          <h3 id="cg-header">BECOME AN ORGANIZER</h3>
          <h3>
            We'll walk you through a few steps to build your local community
          </h3>
        </div>
        <form onSubmit={handleSubmit} id="cg-form">
          <div id="cg-location-info">
            <h3 htmlFor="city">First, set your group's location</h3>
            <h5 htmlFor="city">
              Leetup groups meet locally, in person and online. We'll connect
              you with people in your area, and more can join you online.
            </h5>
            <div id="cg-location-input">
              <div id="cg-city">
                <input
                  placeholder="City"
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                {errors.city && <p>{errors.city}</p>}
              </div>
              <div id="cg-state">
                <input
                  placeholder="State"
                  type="text"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                {errors.state && <p>{errors.state}</p>}
              </div>
            </div>
          </div>
          <div id="cg-name">
            <h3 htmlFor="name">What will your group's name be?</h3>
            <h5 htmlFor="name">
              Choose a name that will give people a clear idea of what the group
              is about. Feel free to get creative! You can edit this later if
              you change your mind.
            </h5>
            <div id="cg-name-input">
              <input
                placeholder="What is your group name?"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p>{errors.name}</p>}
            </div>
          </div>
          <div id="cg-about">
            <h3 htmlFor="about">Now describe what your group will be about</h3>
            <h5 htmlFor="about" id="cg-a-desc">
              People will see this when we promote your group, but you'll be
              able to add to it later, too.
            </h5>
            <h5 htmlFor="about" id="cg-e-1">
              1. What's the purpose of the group?
            </h5>
            <h5 htmlFor="about" id="cg-e-2">
              2. Who should join?
            </h5>
            <h5 htmlFor="about" id="cg-e-3">
              3. What will you do at your events?
            </h5>
            <div id="cg-about-input">
              <textarea
                cols={40}
                placeholder="Please write at least 30 characters"
                type="textarea"
                name="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
              {errors.about && <p>{errors.about}</p>}
            </div>
          </div>
          <div id="cg-fs-div">
            <h3>Final steps...</h3>
            <div id="cg-fs-type">
              <h5 htmlFor="type">Is this an in person or online group?</h5>
              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">select one</option>
                <option value="In person">In person</option>
                <option value="Online">Online</option>
              </select>
              {errors.type && <p>{errors.type}</p>}
            </div>
            <div id="cg-fs-private">
              <h5 htmlFor="privacy">Is this group private or public?</h5>
              <select
                name="privacy"
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <option>select one</option>
                <option value="true">Private</option>
                <option value="false">Public</option>
              </select>
              {errors.private && <p>{errors.private}</p>}
            </div>
            <div id="cg-fs-image">
              <h5 htmlFor="url">
                Please add an image url for your group below:
              </h5>
              <input
                placeholder="Image Url"
                type="text"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {imgErrors.url && <p>{imgErrors.url}</p>}
            </div>
          </div>
          <button type="submit">Create group</button>
        </form>
      </div>
    </>
  );
}

export default CreateGroup;
