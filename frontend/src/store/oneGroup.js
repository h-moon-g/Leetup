import { csrfFetch } from "./csrf";

const LOAD = "oneGroup/LOAD";

const load = (list) => ({
  type: LOAD,
  list,
});

export const getOneGroup = (id) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${id}`);

  if (response.ok) {
    const group = await response.json();
    dispatch(load(group));
  }
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
