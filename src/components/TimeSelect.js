import React from "react";
import { Select } from "@chakra-ui/react";

// Utilities
import { getTimes } from "../utilities";

const TimeSelect = ({ children, increment = 15, ...rest }) => {
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
