import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { createGroup } from "../../store/oneGroup";
import { createImg } from "../../store/oneGroup";

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
    }
  };

  return (
    <>
      <div>
        <h3>BECOME AN ORGANIZER</h3>
        <h3>
          We'll walk you through a few steps to build your local community
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="city">First, set your group's location</label>
        <label htmlFor="city">
          Leetup groups meet locally, in person and online. We'll connect you
          with people in your area, and more can join you online.
        </label>
        <input
          placeholder="City"
          type="text"
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {errors.city && <p>{errors.city}</p>}
        <input
          placeholder="State"
          type="text"
          name="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        {errors.state && <p>{errors.state}</p>}
        <label htmlFor="name">What will your group's name be?</label>
        <label htmlFor="name">
          Choose a name that will give people a clear idea of what the group is
          about. Feel free to get creative! You can edit this later if you
          change your mind.
        </label>
        <input
          placeholder="What is your group name?"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p>{errors.name}</p>}
        <label htmlFor="about">
          Now describe what your group will be about
        </label>
        <label htmlFor="about">
          People will see this when we promote your group, but you'll be able to
          add to it later, too.
        </label>
        <label htmlFor="about">1. What's the purpose of the group?</label>
        <label htmlFor="about">2. Who should join?</label>
        <label htmlFor="about">3. What will you do at your events?</label>
        <input
          placeholder="Please write at least 30 characters"
          type="text"
          name="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
        {errors.about && <p>{errors.about}</p>}
        <label>Final steps...</label>
        <label htmlFor="type">Is this an in person or online group?</label>
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
        <label htmlFor="privacy">Is this group private or public?</label>
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
        <label htmlFor="url">
          Please add an image url for your group below:
        </label>
        <input
          placeholder="Image Url"
          type="text"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {imgErrors.url && <p>{imgErrors.url}</p>}
        <button type="submit">Create group</button>
      </form>
    </>
  );
}

export default CreateGroup;
