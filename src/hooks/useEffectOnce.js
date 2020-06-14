////////////////////////////////////////////////////////////////////////////////
// Source: https://github.com/streamich/react-use

import React from "react";

const useEffectOnce = effect => {
  React.useEffect(effect, []);
};

export default useEffectOnce;
