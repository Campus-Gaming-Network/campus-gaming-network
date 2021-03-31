////////////////////////////////////////////////////////////////////////////////
// API Constants

export const STATE_TYPES = {
  IDLE: "idle",
  LOADING: "loading",
  DONE: "done",
  ERROR: "error",
};

export const STATES = {
  ...STATE_TYPES,
  INITIAL: STATE_TYPES.IDLE,
};
