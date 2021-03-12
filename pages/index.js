import React from "react";
import { Box, Heading, Text, Stack, List } from "@chakra-ui/react";
import safeJsonStringify from "safe-json-stringify";
import nookies from "nookies";
import firebaseAdmin from "src/firebaseAdmin";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import Link from "src/components/Link";
import EventListItem from "src/components/EventListItem";

// Constants
import { AUTH_STATUS } from "src/constants/auth";
import { COOKIES } from "src/constants/other";

// API
import {
  getUserDetails,
  getUserAttendingEvents,
  getUserCreatedEvents
} from "src/api/user";
import { getSchoolEvents } from "src/api/school";
import { getRecentlyCreatedEvents } from "src/api/events";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  const data = {
    user: null,
    userAttendingEvents: [],
    userCreatedEvents: [],
    schoolEvents: [],
    recentlyCreatedEvents: []
  };

  try {
    const cookies = nookies.get(context);
    const token =
      Boolean(cookies) && Boolean(cookies[COOKIES.AUTH_TOKEN])
        ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
        : null;
    const authStatus =
      Boolean(token) && Boolean(token.uid)
        ? AUTH_STATUS.AUTHENTICATED
        : AUTH_STATUS.UNAUTHENTICATED;

    if (authStatus === AUTH_STATUS.AUTHENTICATED) {
      const { user } = await getUserDetails(token.uid);

      data.user = user;

      const [
        userAttendingEventsRes,
        schoolEventsRes,
        userCreatedEventsRes
      ] = await Promise.all([
        getUserAttendingEvents(user.id),
        getSchoolEvents(user.school.id),
        getUserCreatedEvents(user.id)
      ]);

      data.userAttendingEvents = userAttendingEventsRes.events;
      data.schoolEvents = schoolEventsRes.events;
      data.userCreatedEvents = userCreatedEventsRes.events;
    }

    const { events: recentlyCreatedEvents } = await getRecentlyCreatedEvents();

    data.recentlyCreatedEvents = recentlyCreatedEvents;
  } catch (error) {
    // Do nothing
  }

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Home

const Home = props => {
  const { authUser } = useAuth();
  const isAuthenticated = React.useMemo(
    () => Boolean(authUser) && Boolean(authUser.uid),
    [authUser]
  );

  return (
    <SiteLayout>
      <Article>
        <Box>
          <Heading size="2xl" mb={8}>
            Campus Gaming Network
          </Heading>
          <Text fontSize="3xl" color="gray.60">
            Connect with other collegiate gamers for casual or competitive
            gaming at your school or nearby.
          </Text>
          <Stack pt={8} spacing={8}>
            {isAuthenticated ? (
              <UserCreatedEvents events={props.userCreatedEvents} />
            ) : null}
            {isAuthenticated ? (
              <AttendingEvents events={props.userAttendingEvents} />
            ) : null}
            {isAuthenticated ? (
              <UpcomingSchoolEvents events={props.schoolEvents} />
            ) : null}
            <RecentlyCreatedEvents events={props.recentlyCreatedEvents} />
          </Stack>
        </Box>
      </Article>
    </SiteLayout>
  );
};

const UserCreatedEvents = props => {
  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Your events
      </Heading>
      {Boolean(props.events) && props.events.length > 0 ? (
        <React.Fragment>
          <List d="flex" flexWrap="wrap" m={-2} p={0}>
            {props.events.map(event => (
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
  );
};

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

const UpcomingSchoolEvents = props => {
  const [{ school } = {}] = props.events;

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
      {Boolean(props.events) && props.events.length > 0 ? (
        <React.Fragment>
          <List d="flex" flexWrap="wrap" m={-2} p={0}>
            {props.events.map(event => (
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

const RecentlyCreatedEvents = props => {
  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Recently created events
      </Heading>
      {Boolean(props.events) && props.events.length > 0 ? (
        <React.Fragment>
          <List d="flex" flexWrap="wrap" m={-2} p={0}>
            {props.events.map(event => (
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

export default Home;
