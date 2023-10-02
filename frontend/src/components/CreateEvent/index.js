import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { createEvent, deleteEvent } from "../../store/oneEvent";
import { getOneGroup } from "../../store/oneGroup";
import { createImg } from "../../store/oneEvent";
import "./CreateEvent.css";

function CreateEvent() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [imgErrors, setImgErrors] = useState({});

  const history = useHistory();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getOneGroup(id));
  }, [dispatch, id]);

  const group = useSelector((state) => state.group);

  if (!Object.values(group).length) {
    return null;
  }

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
    const createdEvent = await dispatch(
      createEvent({
        id,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      })
    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
    const validated = validateImg();
    if (createdEvent && validated) {
      await dispatch(
        createImg({
          id: createdEvent.id,
          url,
        })
      ).catch(async (res) => {
        await res.json();
      });
      history.push(`/events/${createdEvent.id}`);
    } else {
      if (createdEvent) {
        dispatch(deleteEvent(createdEvent.id));
      }
    }
  };
  return (
    <>
      <div id="ce-form">
        <div>
          <h2>Create an event for {group.name}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div id="ce-name-div">
            <h5 htmlFor="name">What is the name of your event?</h5>
            <input
              placeholder="Event Name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p>{errors.name}</p>}
          </div>
          <div id="ce-type-price">
            <h5 htmlFor="type">Is this an in person or online event?</h5>
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
            <h5 htmlFor="price">What is the price for your event?</h5>
            <input
              placeholder="0"
              type="number"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && <p>{errors.price}</p>}
          </div>
          <div id="ce-date">
            <h5 htmlFor="startDate">When does your event start?</h5>
            <input
              placeholder="MM/DD/YYYY HH.mm AM"
              type="datetime-local"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            {errors.startDate && <p>{errors.startDate}</p>}
            <h5 htmlFor="endDate">When does your event end?</h5>
            <input
              placeholder="MM/DD/YYYY HH.mm PM"
              type="datetime-local"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {errors.endDate && <p>{errors.endDate}</p>}
          </div>
          <div id="ce-image">
            <h5 htmlFor="url">Please add an image url for your event below:</h5>
            <input
              placeholder="Image Url"
              type="text"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {imgErrors.url && <p>{imgErrors.url}</p>}
          </div>
          <div id="ce-describe">
            <h5 htmlFor="description">Please describe your event:</h5>
            <textarea
              cols={81}
              placeholder="Please include at least 30 characters"
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <p>{errors.description}</p>}
          </div>
          <div id="ce-button">
            <button type="submit">Create event</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateEvent;
