import { csrfFetch } from "./csrf";

const LOAD = "oneGroup/LOAD";
const SET_GROUP = "oneGroup/SET_GROUP";

const load = (list) => ({
  type: LOAD,
  list,
});

const setGroup = (group) => {
  return {
    type: SET_GROUP,
    payload: group,
  };
};

export const getOneGroup = (id) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${id}`);

    if (response.ok) {
      const group = await response.json();
      dispatch(load(group));
    }
  } catch (error) {
    console.error(error);
  }
};

export const createGroup = (group) => async (dispatch) => {
  let { name, about, type, privacy, city, state } = group;
  if (privacy === "true") {
    privacy = true;
  } else {
    privacy = false;
  }
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    body: JSON.stringify({
      name,
      about,
      type,
      private: privacy,
      city,
      state,
    }),
  });
  const data = await response.json();
  dispatch(setGroup(data.group));
  return response;
};

const initialState = {};

const groupReducer = (state = initialState, action) => {
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

export default groupReducer;
