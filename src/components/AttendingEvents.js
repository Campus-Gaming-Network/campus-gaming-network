import React from "react";
import { Heading, Text, Stack, List } from "@chakra-ui/react";

// Components
import EventListItem from "src/components/EventListItem";

const AttendingEvents = props => {
  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Events you're attending
      </Heading>
      {Boolean(props.events) && props.events.length > 0 ? (
        <React.Fragment>
          <List d="flex" flexWrap="wrap" m={-2} p={0}>
            {props.events.map(event => (
              <EventListItem key={event.id} {...event} />
            ))}
          </List>
        </React.Fragment>
      ) : (
        <Text color="gray.400" fontSize="xl" fontWeight="600">
          You are not attending any upcoming events
        </Text>
      )}
    </Stack>
  );
};

export default AttendingEvents;
