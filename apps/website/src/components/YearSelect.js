// Libraries
import React from "react";
import { Select } from "src/components/common";

// Constants
import { CURRENT_YEAR } from "src/constants/dateTime";

// Utilities
import { getYears } from "src/utilities/dateTime";

////////////////////////////////////////////////////////////////////////////////
// YearSelect

const YearSelect = ({
  children,
  min = CURRENT_YEAR,
  max = CURRENT_YEAR,
  reverseOptions = false,
  ...rest
}) => {
  const OPTIONS = React.useMemo(
    () =>
      getYears(min, max, { reverse: reverseOptions }).map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      )),
    [min, max, reverseOptions]
  );

  return (
    <Select {...rest}>
      <option value="">Select year</option>
      {OPTIONS}
    </Select>
  );
};

export default YearSelect;
