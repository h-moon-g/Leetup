import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { updateGroup, getOneGroup } from "../../store/oneGroup";

function UpdateGroup() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState({});

  const { id } = useParams();

  useEffect(() => {
    dispatch(getOneGroup(id));
  }, [dispatch, id]);

  const group = useSelector((state) => state.group);

  if (!Object.values(group).length) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(
      updateGroup({
        id,
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
  };

  return (
    <>
      <div>
        <h3>UPDATE YOUR GROUPS INFORMATION</h3>
        <h3>
          We'll walk you through a few steps to update your group's information
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
          <option value="">select one</option>
          <option value="true">Private</option>
          <option value="false">Public</option>
        </select>
        {errors.privacy && <p>{errors.privacy}</p>}
        <button type="submit">Create group</button>
      </form>
    </>
  );
}

export default UpdateGroup;
