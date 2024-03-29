// Libraries
import React from "react";
import { Select } from "src/components/common";

// Constants
import { MONTHS } from "src/constants/dateTime";

const OPTIONS = MONTHS.map((month) => (
  <option key={month} value={month}>
    {month}
  </option>
));

////////////////////////////////////////////////////////////////////////////////
// MonthSelect

const MonthSelect = ({ children, ...rest }) => {
  return (
    <Select {...rest}>
      <option value="">Select month</option>
      {OPTIONS}
    </Select>
  );
};

export default MonthSelect;
