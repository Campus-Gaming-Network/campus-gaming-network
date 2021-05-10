// Libraries
import React from "react";
import { Select } from "@chakra-ui/react";

// Constants
import { DAYS } from "src/constants/dateTime";

const OPTIONS = DAYS.map((day) => (
  <option key={day} value={day}>
    {day}
  </option>
));

////////////////////////////////////////////////////////////////////////////////
// DaySelect

const DaySelect = ({ children, ...rest }) => {
  return (
    <Select {...rest}>
      <option value="">Select day</option>
      {OPTIONS}
    </Select>
  );
};

export default DaySelect;
