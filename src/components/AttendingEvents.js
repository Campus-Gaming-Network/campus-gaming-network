// Libraries
import React from "react";
import { Heading, Stack, List } from "@chakra-ui/react";

// Hooks
import useFetchUserEvents from "src/hooks/useFetchUserEvents";

// Components
import EventListItem from "src/components/EventListItem";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";
import EmptyText from "src/components/EmptyText";

////////////////////////////////////////////////////////////////////////////////
// AttendingEvents

const AttendingEvents = (props) => {
  const [events, state] = useFetchUserEvents(props?.user?.id);
  const hasEvents = React.useMemo(() => Boolean(events) && events.length > 0, [
    events,
  ]);

  return (
    <React.Fragment>
      {state === "idle" || state === "loading" ? (
        <SliderSilhouette />
      ) : (
        <Stack
          as="section"
          spacing={4}
          bg="white"
          p={6}
          shadow="md"
          rounded="md"
          borderWidth={1}
        >
          <Heading as="h3" fontSize="2xl">
            {Boolean(props.title) ? props.title : "Events you're attending"}
          </Heading>
          {!(state === "done" && hasEvents) ? (
            <EmptyText>
              {Boolean(props.emptyText)
                ? props.emptyText
                : "You are not attending any upcoming events"}
            </EmptyText>
          ) : (
            <List d="flex" flexWrap="wrap" m={-2} p={0}>
              {events.map((event) => (
                <EventListItem key={event.id} {...event} />
              ))}
            </List>
          )}
        </Stack>
      )}
    </React.Fragment>
  );
};

export default AttendingEvents;
