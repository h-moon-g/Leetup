const LOAD = "oneEvent/LOAD";

const load = (list) => ({
  type: LOAD,
  list,
});

export const getOneEvent = (id) => async (dispatch) => {
  const response = await fetch(`/api/events/${id}`);

  if (response.ok) {
    const group = await response.json();
    dispatch(load(group));
  }
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
