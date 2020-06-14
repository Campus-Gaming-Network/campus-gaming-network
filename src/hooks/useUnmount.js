////////////////////////////////////////////////////////////////////////////////
// Source: https://github.com/streamich/react-use

import React from "react";

//Hooks
import useEffectOnce from "./useEffectOnce";

const useUnmount = fn => {
  const fnRef = React.useRef(fn);

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn;

  useEffectOnce(() => () => fnRef.current());
};

export default useUnmount;
