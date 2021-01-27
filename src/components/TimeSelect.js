import React from "react";
import { Select } from "@chakra-ui/react";

import { DEFAULT_TIME_INCREMENT } from "constants/dateTime";

// Utilities
import { getTimes } from "utilities/dateTime";

const TimeSelect = ({
  children,
  increment = DEFAULT_TIME_INCREMENT,
  ...rest
}) => {
  const OPTIONS = React.useMemo(
    () =>
      getTimes({ increment }).map(time => (
        <option key={time} value={time}>
          {time}
        </option>
      )),
    [increment]
  );

  return (
    <Select {...rest}>
      <option value="">Select time</option>
      {OPTIONS}
    </Select>
  );
};

export default TimeSelect;
