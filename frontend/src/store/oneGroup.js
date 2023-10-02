import { csrfFetch } from "./csrf";

const LOAD = "oneGroup/LOAD";
const SET_GROUP = "oneGroup/SET_GROUP";
const SET_GROUP_IMG = "oneGroup/SET_GROUP-IMG";
const CHANGE_GROUP = "oneGroup/UPDATE_GROUP";
const REMOVE_GROUP = "session/REMOVE_GROUP";

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

const setGroupImg = (img) => {
  return {
    type: SET_GROUP_IMG,
    payload: img,
  };
};

const changeGroup = (group) => {
  return {
    type: CHANGE_GROUP,
    payload: group,
  };
};

const removeGroup = () => {
  return {
    type: REMOVE_GROUP,
  };
};

export const getOneGroup = (id) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${id}`);

    if (response.ok) {
      const group = await response.json();
      dispatch(load(group));
      return group;
    }
  } catch (error) {
    // console.error(error);
  }
};

export const createGroup = (group) => async (dispatch) => {
  let { name, about, type, privacy, city, state } = group;
  if (privacy === "true") {
    privacy = true;
  } else if (privacy === "false") {
    privacy = "false";
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
  return data;
};

export const createImg = (group) => async (dispatch) => {
  let { id, url } = group;
  let preview = true;
  const response = await csrfFetch(`/api/groups/${id}/images`, {
    method: "POST",
    body: JSON.stringify({
      url,
      preview,
    }),
  });
  const data = await response.json();
  dispatch(setGroupImg(data.group));
  return data;
};

export const updateGroup = (group) => async (dispatch) => {
  let { id, name, about, type, privacy, city, state } = group;
  if (privacy === "true") {
    privacy = true;
  } else if (privacy === "false") {
    privacy = "false";
  } else if (privacy === false) {
    privacy = "false";
  } else if (privacy === true) {
    privacy = true;
  }
  const response = await csrfFetch(`/api/groups/${id}`, {
    method: "PUT",
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
  dispatch(changeGroup(data.group));
  return data;
};

export const deleteGroup = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${id}`, {
    method: "DELETE",
  });
  dispatch(removeGroup());
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
