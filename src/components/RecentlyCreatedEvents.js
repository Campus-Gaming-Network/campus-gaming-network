// Libraries
import React from "react";
import LazyLoad from "react-lazyload";
import { Box, Heading, Text } from "@chakra-ui/react";

// Hooks
import useFetchRecentlyCreatedEvents from "src/hooks/useFetchRecentlyCreatedEvents";

// Components
import EventListItem from "src/components/EventListItem";
import Slider from "src/components/Slider";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";

const RecentlyCreatedEvents = (props) => {
  const [events, state] = useFetchRecentlyCreatedEvents();
  const hasEvents = React.useMemo(() => Boolean(events) && events.length > 0, [
    events,
  ]);

  return (
    <LazyLoad once height={270}>
      {state === "idle" || state === "loading" ? (
        <SliderSilhouette />
      ) : (
        <Box as="section" py={4}>
          <Heading as="h3" fontSize="xl" pb={4}>
            Newest events
          </Heading>
          {!(state === "done" && hasEvents) ? (
            <Text color="gray.400" fontSize="xl" fontWeight="600">
              No events have been recently created
            </Text>
          ) : (
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
          )}
        </Box>
      )}
    </LazyLoad>
  );
};

export default RecentlyCreatedEvents;
