import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { createEvent } from "../../store/oneEvent";
import { getOneGroup } from "../../store/oneGroup";

function CreateEvent() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});

  const history = useHistory();

  const { id } = useParams();

  console.log(id);

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
  };
  return (
    <>
      <div>
        <h3>Create an event for {group.name}</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">What is the name of your event?</label>
        <input
          placeholder="Event Name"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p>{errors.name}</p>}
        <label htmlFor="type">Is this an in person or online event?</label>
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
        <label htmlFor="price">What is the price for your event?</label>
        <input
          placeholder="0"
          type="number"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && <p>{errors.price}</p>}
        <label htmlFor="startDate">When does your event start?</label>
        <input
          placeholder="MM/DD/YYYY HH.mm AM"
          type="datetime-local"
          name="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        {errors.startDate && <p>{errors.startDate}</p>}
        <label htmlFor="endDate">When does your event end?</label>
        <input
          placeholder="MM/DD/YYYY HH.mm PM"
          type="datetime-local"
          name="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        {errors.endDate && <p>{errors.endDate}</p>}
        <label htmlFor="description">
          Now describe what your group will be description
        </label>
        <label htmlFor="description">Please describe your event:</label>
        <input
          placeholder="Please include at least 30 characters"
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p>{errors.description}</p>}
        <button type="submit">Create event</button>
      </form>
    </>
  );
}

export default CreateEvent;