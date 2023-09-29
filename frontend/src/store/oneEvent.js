import { csrfFetch } from "./csrf";

const LOAD = "oneEvent/LOAD";
const SET_EVENT = "oneEvent/SET_EVENT";
const SET_EVENT_IMG = "oneGroup/SET_EVENT-IMG";
const REMOVE_EVENT = "session/REMOVE_EVENT";

const load = (list) => ({
  type: LOAD,
  list,
});

const setEvent = (event) => {
  return {
    type: SET_EVENT,
    payload: event,
  };
};

const setEventImg = (img) => {
  return {
    type: SET_EVENT_IMG,
    payload: img,
  };
};

const removeEvent = () => {
  return {
    type: REMOVE_EVENT,
  };
};

export const getOneEvent = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${id}`);

  if (response.ok) {
    const event = await response.json();
    dispatch(load(event));
  }
};

export const createEvent = (event) => async (dispatch) => {
  let { id, name, type, price, description, startDate, endDate } = event;
  let capacity = 10;
  let venueId = 1;
  price = parseInt(price);
  const response = await csrfFetch(`/api/groups/${id}/events`, {
    method: "POST",
    body: JSON.stringify({
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
      venueId,
    }),
  });
  const data = await response.json();
  dispatch(setEvent(data.event));
  return data;
};

export const createImg = (event) => async (dispatch) => {
  let { id, url } = event;
  let preview = true;
  const response = await csrfFetch(`/api/events/${id}/images`, {
    method: "POST",
    body: JSON.stringify({
      url,
      preview,
    }),
  });
  const data = await response.json();
  dispatch(setEventImg(data.event));
  return data;
};

export const deleteEvent = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${id}`, {
    method: "DELETE",
  });
  dispatch(removeEvent());
  return response;
};

const initialState = {};

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const newState = {
        ...state,
        ...action.list,
      };
      return newState;
    default:
      return state;
  }
};

export default eventReducer;
