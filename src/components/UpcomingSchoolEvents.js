import React from "react";
import { Heading, Text, Stack, List } from "@chakra-ui/react";

// Components
import Link from "src/components/Link";
import EventListItem from "src/components/EventListItem";

const UpcomingSchoolEvents = (props) => {
  const [{ school } = {}] = props.events;
  const [events, setEvents] = React.useState(props.events || []);
  const hasEvents = React.useMemo(() => Boolean(events) && events.length > 0, [
    events,
  ]);

  if (!Boolean(school)) {
    return null;
  }

  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Upcoming events at{" "}
        <Link
          href={`/school/${school.id}`}
          color="brand.500"
          fontWeight="bold"
          isTruncated
          lineHeight="short"
          mt={-2}
          title={school.formattedName}
        >
          {school.formattedName}
        </Link>
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
          There are no upcoming events at {school.formattedName}
        </Text>
      )}
    </Stack>
  );
};

export default UpcomingSchoolEvents;
