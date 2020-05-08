import React, { useContext, createContext, useReducer } from "react";

const initialState = {
  event: null,
  events: null,
  school: null,
  schools: null,
  user: null,
  users: null
};
const AppStateContext = createContext(initialState);
const AppDispatchContext = createContext(initialState);
const reducer = (state, action) => {
  console.log(`[${action.type}]`, action.payload);

  switch (action.type) {
    case "SET_SCHOOL":
      return {
        ...state,
        school: action.payload,
        schools: {
          ...state.schools,
          [action.payload.id]: action.payload
        }
      };
    case "SET_SCHOOL_USERS":
      return {
        ...state,
        school: {
          ...state.school,
          users: action.payload
        },
        schools: {
          ...state.schools,
          [state.school.id]: {
            ...state.school,
            users: action.payload
          }
        }
      };
    case "SET_SCHOOL_EVENTS":
      return {
        ...state,
        school: {
          ...state.school,
          events: action.payload
        },
        schools: {
          ...state.schools,
          [state.school.id]: {
            ...state.school,
            events: action.payload
          }
        }
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        users: {
          ...state.users,
          [action.payload.id]: action.payload
        }
      };
    case "SET_USER_EVENTS":
      return {
        ...state,
        user: {
          ...state.user,
          events: action.payload
        },
        users: {
          ...state.users,
          [state.user.id]: {
            ...state.user,
            events: action.payload
          }
        }
      };
    case "SET_EVENT":
      return {
        ...state,
        event: action.payload,
        events: {
          ...state.events,
          [action.payload.id]: action.payload
        }
      };
    case "SET_EVENT_USERS":
      return {
        ...state,
        event: {
          ...state.event,
          users: action.payload
        },
        events: {
          ...state.events,
          [state.event.id]: {
            ...state.event,
            users: action.payload
          }
        }
      };
    case "SET_SCHOOLS":
      return {
        ...state,
        schools: {
          ...state.schools,
          ...action.payload
        }
      };
    case "SET_USERS":
      return {
        ...state,
        users: {
          ...state.users,
          ...action.payload
        }
      };
    case "SET_EVENTS":
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
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {props.children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

const useCountState = () => {
  const context = useContext(AppStateContext);

  if (context === undefined) {
    throw new Error("useAppState must be used within a Appvider");
  }

  return context;
};

const useCountDispatch = () => {
  const context = useContext(AppDispatchContext);

  if (context === undefined) {
    throw new Error("useAppDispatch must be used within a AppProvider");
  }

  return context;
};

export { AppProvider, useCountState, useCountDispatch };
