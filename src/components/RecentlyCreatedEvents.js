// Libraries
import React from "react";
import { Box, Heading } from "@chakra-ui/react";

// Hooks
import useFetchRecentlyCreatedEvents from "src/hooks/useFetchRecentlyCreatedEvents";

// Components
import EventListItem from "src/components/EventListItem";
import Slider from "src/components/Slider";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";
import EmptyText from "src/components/EmptyText";

////////////////////////////////////////////////////////////////////////////////
// RecentlyCreatedEvents

const RecentlyCreatedEvents = () => {
  const [events, state] = useFetchRecentlyCreatedEvents();
  const hasEvents = React.useMemo(() => Boolean(events) && events.length > 0, [
    events,
  ]);

  return (
    <React.Fragment>
      {state === "idle" || state === "loading" ? (
        <SliderSilhouette />
      ) : (
        <Box as="section" py={4}>
          <Heading as="h3" fontSize="xl" pb={4}>
            Newest events
          </Heading>
          {!(state === "done" && hasEvents) ? (
            <EmptyText>No events have been recently created</EmptyText>
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
    </React.Fragment>
  );
};

export default RecentlyCreatedEvents;
