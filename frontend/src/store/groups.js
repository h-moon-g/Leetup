import { csrfFetch } from "./csrf";

const LOAD = "groups/LOAD";

const load = (list) => ({
  type: LOAD,
  list,
});

export const getGroups = () => async (dispatch) => {
  const response = await csrfFetch(`/api/groups`);

  if (response.ok) {
    const list = await response.json();
    dispatch(load(list));
    return list;
  }
};

const initialState = {
  list: [],
};

const sortList = (list) => {
  return list.Groups.sort((groupA, groupB) => {
    return groupA.id - groupB.id;
  }).map((group) => group.id);
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const allGroups = {};
      action.list.Groups.forEach((group) => {
        allGroups[group.id] = group;
      });
      return {
        ...state,
        ...allGroups,
        list: sortList(action.list),
      };
    default:
      return state;
  }
};

export default groupsReducer;
