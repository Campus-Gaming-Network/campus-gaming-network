import React from "react";
import { Stack, Button, Text, Alert } from "@chakra-ui/react";

const EventResponseAlert = (props) => {
  return (
    <Alert
      status="success"
      variant="subtle"
      flexDirection="column"
      justifyContent="center"
      textAlign="center"
      height="100px"
      rounded="lg"
    >
      <Stack>
        <Text fontWeight="bold" fontSize="2xl" color="green.500">
          You’re going!
        </Text>
        <Button
          onClick={props.onClick}
          variant="link"
          color="green.500"
          display="inline"
        >
          Cancel your RSVP
        </Button>
      </Stack>
    </Alert>
  );
};

export default EventResponseAlert;
