import { csrfFetch } from "./csrf";

const LOAD = "events/LOAD";

const load = (list) => ({
  type: LOAD,
  list,
});

export const getEvents = () => async (dispatch) => {
  const response = await csrfFetch(`/api/events`);

  if (response.ok) {
    const list = await response.json();
    dispatch(load(list));
  }
};

const initialState = {
  list: [],
};

const sortList = (list) => {
  return list.Events.sort((eventA, eventB) => {
    return eventA.id - eventB.id;
  }).map((event) => event.id);
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const allEvents = {};
      action.list.Events.forEach((event) => {
        allEvents[event.id] = event;
      });
      return {
        ...allEvents,
        ...state,
        list: sortList(action.list),
      };
    default:
      return state;
  }
};

export default eventsReducer;
