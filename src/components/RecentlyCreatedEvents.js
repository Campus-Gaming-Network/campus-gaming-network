import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

// Components
import EventListItem from "src/components/EventListItem";
import Slider from "src/components/Slider";

const RecentlyCreatedEvents = (props) => {
  const [events, setEvents] = React.useState(props.events || []);
  const hasEvents = React.useMemo(() => Boolean(events) && events.length > 0, [
    events,
  ]);

  return (
    <Box as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Newest events
      </Heading>
      {hasEvents ? (
        <React.Fragment>
          <Slider
            settings={{
              className: events.length < 5 ? "slick--less-slides" : "",
            }}
          >
            {events.map((event) => (
              <EventListItem
                key={event.id}
                event={event}
                school={event.school}
              />
            ))}
          </Slider>
        </React.Fragment>
      ) : (
        <Text color="gray.400" fontSize="xl" fontWeight="600">
          No events have been recently created
        </Text>
      )}
    </Box>
  );
};

export default RecentlyCreatedEvents;
