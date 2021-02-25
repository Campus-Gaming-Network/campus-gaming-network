import React from "react";
import keyBy from "lodash.keyby";
import { mapUser } from "src/utilities/user";
import { mapSchool } from "src/utilities/school";
import { mapEvent } from "src/utilities/event";
import { mapEventResponse } from "src/utilities/eventResponse";
import { isDev } from "src/utilities/other";
import { INITIAL_STORE } from "src/constants/store";
import { ACTION_TYPES } from "src/constants/actions";

const AppStateContext = React.createContext();
const AppDispatchContext = React.createContext();

const reducer = (state, action) => {
  if (isDev()) {
    console.log(`[${action.type}] ->`, action.payload);
  }

  switch (action.type) {
    case ACTION_TYPES.SET_SCHOOL:
      return {
        ...state,
        school: mapSchool(action.payload),
        schools: {
          ...state.schools,
          [action.payload.id]: mapSchool(action.payload)
        }
      };
    case ACTION_TYPES.SET_SCHOOL_USERS:
      return {
        ...state,
        school: {
          ...state.school,
          users: {
            ...state.school.users,
            [action.payload.page]: action.payload.users.map(mapUser)
          }
        },
        schools: {
          ...state.schools,
          [action.payload.id]: {
            ...state.schools[action.payload.id],
            users: {
              ...state.schools[action.payload.id].users,
              [action.payload.page]: action.payload.users.map(mapUser)
            }
          }
        }
      };
    case ACTION_TYPES.SET_SCHOOL_EVENTS:
      return {
        ...state,
        school: {
          ...state.school,
          events: action.payload.events.map(mapEvent)
        },
        schools: {
          ...state.schools,
          [action.payload.id]: {
            ...state.schools[action.payload.id],
            events: {
              ...state.schools[action.payload.id].events,
              [action.payload.page]: action.payload.events.map(mapEvent)
            }
          }
        },
        events: {
          ...state.events,
          ...keyBy(action.payload.events.map(mapEvent), "id")
        }
      };
    case ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: mapUser(action.payload),
        users: {
          ...state.users,
          [action.payload.id]: mapUser(action.payload)
        }
      };
    case ACTION_TYPES.SET_USER_EVENTS:
      return {
        ...state,
        user: {
          ...state.user,
          events: action.payload.events.map(mapEventResponse)
        },
        users: {
          ...state.users,
          [action.payload.id]: {
            ...state.users[action.payload.id],
            events: action.payload.events.map(mapEventResponse)
          }
        },
        events: {
          ...state.events,
          ...keyBy(action.payload.events.map(mapEventResponse), "id")
        }
      };
    case ACTION_TYPES.SET_EVENT:
      return {
        ...state,
        event: action.payload,
        events: {
          ...state.events,
          [action.payload.id]: action.payload
        }
      };
    case ACTION_TYPES.SET_EVENT_USERS:
      return {
        ...state,
        event: {
          ...state.event,
          users: {
            ...state.school.users,
            [action.payload.page]: action.payload.users.map(mapUser)
          }
        },
        events: {
          ...state.events,
          [action.payload.id]: {
            ...state.events[action.payload.id],
            users: {
              ...state.events[action.payload.id].users,
              [action.payload.page]: action.payload.users.map(mapUser)
            }
          }
        }
      };
    case ACTION_TYPES.SET_SCHOOLS:
      return {
        ...state,
        schools: {
          ...state.schools,
          ...action.payload
        }
      };
    case ACTION_TYPES.SET_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          ...action.payload
        }
      };
    case ACTION_TYPES.SET_EVENTS:
      return {
        ...state,
        events: {
          ...state.events,
          ...action.payload
        }
      };
    case ACTION_TYPES.SET_GAMES:
      return {
        ...state,
        games: {
          ...state.games,
          ...action.payload
        }
      };
    default:
      break;
  }
};

const AppProvider = props => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STORE);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {props.children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

const useAppState = () => {
  const context = React.useContext(AppStateContext);

  if (context === undefined) {
    throw new Error("useAppState must be used within a AppProvider");
  }

  return context;
};

const useAppDispatch = () => {
  const context = React.useContext(AppDispatchContext);

  if (context === undefined) {
    throw new Error("useAppDispatch must be used within a AppProvider");
  }

  return context;
};

export { AppProvider, useAppState, useAppDispatch, ACTION_TYPES };
