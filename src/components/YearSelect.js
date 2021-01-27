import React from "react";
import { Select } from "@chakra-ui/react";

// Constants
import { CURRENT_YEAR } from "constants/dateTime";

// Utilities
import { getYears } from "utilities/dateTime";

const YearSelect = ({
  children,
  min = CURRENT_YEAR,
  max = CURRENT_YEAR,
  reverseOptions = false,
  ...rest
}) => {
  const OPTIONS = React.useMemo(
    () =>
      getYears(min, max, { reverse: reverseOptions }).map(year => (
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
