////////////////////////////////////////////////////////////////////////////////
// Source: https://github.com/streamich/react-use

import React from "react";

// Hooks
import useUnmount from "./useUnmount";

const useThrottle = (value, ms = 200) => {
  const [state, setState] = React.useState(value);
  const timeout = React.useRef();
  const nextValue = React.useRef(null);
  const hasNextValue = React.useRef(0);

  React.useEffect(() => {
    if (!timeout.current) {
      setState(value);
      const timeoutCallback = () => {
        if (hasNextValue.current) {
          hasNextValue.current = false;
          setState(nextValue.current);
          timeout.current = setTimeout(timeoutCallback, ms);
        } else {
          timeout.current = undefined;
        }
      };
      timeout.current = setTimeout(timeoutCallback, ms);
    } else {
      nextValue.current = value;
      hasNextValue.current = true;
    }
  }, [value, ms]);

  useUnmount(() => {
    timeout.current && clearTimeout(timeout.current);
  });

  return state;
};

export default useThrottle;
