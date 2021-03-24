import React from "react";
import { Box, Heading, Text, Stack, List } from "@chakra-ui/react";

// Components
import EventListItem from "src/components/EventListItem";

const RecentlyCreatedEvents = (props) => {
  const [events, setEvents] = React.useState(props.events || []);
  const hasEvents = React.useMemo(() => Boolean(events) && events.length > 0, [
    events,
  ]);

  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Newest events
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
          No events have been recently created
        </Text>
      )}
    </Stack>
  );
};

export default RecentlyCreatedEvents;
