// Libraries
import React from "react";
import { Heading, Box } from "@chakra-ui/react";

// Hooks
import useFetchUserCreatedEvents from "src/hooks/useFetchUserCreatedEvents";

// Components
import EventListItem from "src/components/EventListItem";
import Slider from "src/components/Slider";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";
import EmptyText from "src/components/EmptyText";

const UserCreatedEvents = (props) => {
  const id = React.useMemo(() => props?.user?.id, [props]);
  const [events, state] = useFetchUserCreatedEvents(id);
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
            Your events
          </Heading>
          {!(state === "done" && hasEvents) ? (
            <EmptyText>You have no events</EmptyText>
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

export default UserCreatedEvents;
