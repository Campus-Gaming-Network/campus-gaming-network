// Libraries
import React from "react";
import { Text } from "src/components/common";

// Utilities
import { firebaseToLocaleString } from "src/utilities/dateTime";

////////////////////////////////////////////////////////////////////////////////
// Time

const Time = ({ children, dateTime, ...rest }) => {
  const _dateTime = React.useMemo(
    () => firebaseToLocaleString(dateTime),
    [dateTime]
  );

  if (!process.browser || !_dateTime) {
    return null;
  }

  return (
    <Text as="time" dateTime={_dateTime} title={_dateTime} {...rest}>
      {_dateTime}
    </Text>
  );
};

export default Time;
