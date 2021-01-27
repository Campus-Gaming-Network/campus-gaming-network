import React from "react";
import { Select } from "@chakra-ui/react";

// Constants
import { MONTHS } from "constants/dateTime";

const OPTIONS = MONTHS.map(month => (
  <option key={month} value={month}>
    {month}
  </option>
));

const MonthSelect = ({ children, ...rest }) => {
  return (
    <Select {...rest}>
      <option value="">Select month</option>
      {OPTIONS}
    </Select>
  );
};

export default MonthSelect;
