import React from "react";
import LazyLoad from "react-lazyload";
import { Heading, Text, Box, List } from "@chakra-ui/react";

// Hooks
import useFetchSchoolEvents from "src/hooks/useFetchSchoolEvents";

// Components
import Link from "src/components/Link";
import EventListItem from "src/components/EventListItem";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";

const UpcomingSchoolEvents = (props) => {
  const [events, state] = useFetchSchoolEvents(props.school.id);
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
            Upcoming events at{" "}
            <Link
              href={`/school/${props.school.id}`}
              color="brand.500"
              fontWeight="bold"
              isTruncated
              lineHeight="short"
              mt={-2}
              title={props.school.formattedName}
            >
              {props.school.formattedName}
            </Link>
          </Heading>
          {!(state === "done" && hasEvents) ? (
            <Text color="gray.400" fontSize="xl" fontWeight="600">
              There are no upcoming events at {props.school.formattedName}
            </Text>
          ) : (
            <List d="flex" flexWrap="wrap" m={-2} p={0}>
              {events.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  school={event.school}
                />
              ))}
            </List>
          )}
        </Box>
      )}
    </LazyLoad>
  );
};

export default UpcomingSchoolEvents;
