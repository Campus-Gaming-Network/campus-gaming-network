import React from "react";
import LazyLoad from "react-lazyload";
import { Heading, Text, Stack, List } from "@chakra-ui/react";

// Components
import EventListItem from "src/components/EventListItem";

const UserCreatedEvents = (props) => {
  const [events, setEvents] = React.useState(props.events || []);
  const hasEvents = React.useMemo(() => Boolean(events) && events.length > 0, [
    events,
  ]);

  return (
    <LazyLoad once>
      <Stack as="section" spacing={2} py={4}>
        <Heading as="h3" fontSize="xl" pb={4}>
          Your events
        </Heading>
        {hasEvents ? (
          <React.Fragment>
            <List d="flex" flexWrap="wrap" m={-2} p={0}>
              {events.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  school={event.school}
                />
              ))}
            </List>
          </React.Fragment>
        ) : (
          <Text color="gray.400" fontSize="xl" fontWeight="600">
            You have no events
          </Text>
        )}
      </Stack>
    </LazyLoad>
  );
};

export default UserCreatedEvents;
