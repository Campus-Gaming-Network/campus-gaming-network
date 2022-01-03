// Libraries
import React from "react";
import { Select } from "@chakra-ui/react";

// Constants
import { DEFAULT_TIME_INCREMENT } from "src/constants/dateTime";

// Utilities
import { getTimes } from "src/utilities/dateTime";

////////////////////////////////////////////////////////////////////////////////
// TimeSelect

const TimeSelect = ({
  children,
  increment = DEFAULT_TIME_INCREMENT,
  ...rest
}) => {
  const OPTIONS = React.useMemo(
    () =>
      getTimes({ increment }).map((time) => (
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
