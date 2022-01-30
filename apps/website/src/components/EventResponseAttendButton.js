// Libraries
import React from "react";
import { Button } from "src/components/common";

////////////////////////////////////////////////////////////////////////////////
// EventResponseAttendButton

const EventResponseAttendButton = (props) => {
  return (
    <Button onClick={props.onClick} colorScheme="brand" w="200px">
      Attend Event
    </Button>
  );
};

export default EventResponseAttendButton;
