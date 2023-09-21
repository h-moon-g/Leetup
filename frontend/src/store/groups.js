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

// import { csrfFetch } from "./csrf";

// const SET_GROUP = "createGroup/setGroup";

// const setGroup = (group) => {
//   return {
//     type: SET_GROUP,
//     payload: group,
//   };
// };

// export const createGroup = (group) => async (dispatch) => {
//   const { name, about, type, private, city, state } = group;
//   const response = await csrfFetch("/api/groups", {
//     method: "POST",
//     body: JSON.stringify({
//       name,
//       about,
//       type,
//       private,
//       city,
//       state,
//     }),
//   });
//   const data = await response.json();
//   dispatch(setGroup(data.group));
//   return response;
// };

// const initialState = { user: null };

// const createGroupReducer = (state = initialState, action) => {
//   let newState;
//   switch (action.type) {
//     case SET_USER:
//       newState = Object.assign({}, state);
//       newState.user = action.payload;
//       return newState;
//     case REMOVE_USER:
//       newState = Object.assign({}, state);
//       newState.user = null;
//       return newState;
//     default:
//       return state;
//   }
// };

// export default createGroupReducer;
