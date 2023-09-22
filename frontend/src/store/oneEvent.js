import { csrfFetch } from "./csrf";

const LOAD = "oneEvent/LOAD";
const SET_EVENT = "oneEvent/SET_EVENT";
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

const removeEvent = () => {
  return {
    type: REMOVE_EVENT,
  };
};

export const getOneEvent = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${id}`);

  if (response.ok) {
    const group = await response.json();
    dispatch(load(group));
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
  dispatch(setEvent(data.group));
  return response;
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
