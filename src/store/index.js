import React from "react";
import { isDev, mapUser } from "../utilities";

const INITIAL_STATE = {
  event: {},
  events: {},
  school: {},
  schools: {},
  user: {},
  users: {}
};

const ACTION_TYPES = {
  SET_SCHOOL: "SET_SCHOOL",
  SET_SCHOOL_USERS: "SET_SCHOOL_USERS",
  SET_SCHOOL_EVENTS: "SET_SCHOOL_EVENTS",
  SET_SCHOOL_LOGO: "SET_SCHOOL_LOGO",
  SET_USER: "SET_USER",
  SET_USER_EVENTS: "SET_USER_EVENTS",
  SET_EVENT: "SET_EVENT",
  SET_EVENT_USERS: "SET_EVENT_USERS",
  SET_SCHOOLS: "SET_SCHOOLS",
  SET_USERS: "SET_USERS",
  SET_EVENTS: "SET_EVENTS"
};

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
        school: action.payload,
        schools: {
          ...state.schools,
          [action.payload.id]: action.payload
        }
      };
    case ACTION_TYPES.SET_SCHOOL_USERS:
      return {
        ...state,
        school: {
          ...state.school,
          users: action.payload.users
        },
        schools: {
          ...state.schools,
          [action.payload.id]: {
            ...state.schools[action.payload.id],
            users: action.payload.users
          }
        }
      };
    case ACTION_TYPES.SET_SCHOOL_EVENTS:
      return {
        ...state,
        school: {
          ...state.school,
          events: action.payload.events
        },
        schools: {
          ...state.schools,
          [action.payload.id]: {
            ...state.schools[action.payload.id],
            events: action.payload.events
          }
        }
      };
    case ACTION_TYPES.SET_SCHOOL_LOGO:
      return {
        ...state,
        school: {
          ...state.school,
          logo: action.payload.logo
        },
        schools: {
          ...state.schools,
          [action.payload.id]: {
            ...state.schools[action.payload.id],
            logo: action.payload.logo
          }
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
          events: action.payload.events
        },
        users: {
          ...state.users,
          [action.payload.id]: {
            ...state.users[action.payload.id],
            events: action.payload.events
          }
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
          users: action.payload.users
        },
        events: {
          ...state.events,
          [action.payload.id]: {
            ...state.events[action.payload.id],
            users: action.payload.users
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
    default:
      break;
  }
};

const AppProvider = props => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);

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
