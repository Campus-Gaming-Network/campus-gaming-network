import React from "react";
import { firebase } from "src/firebase";
import { Box, Heading, Text, Stack, List } from "@chakra-ui/react";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import startCase from "lodash.startcase";
import * as firebaseAdmin from "firebase-admin";
import nookies from "nookies";
import Head from "next/head";
import safeJsonStringify from "safe-json-stringify";

// Components
import Link from "src/components/Link";
import EventListItem from "src/components/EventListItem";

// Utilities
import { mapEvent } from "src/utilities/event";
import { mapEventResponse } from "src/utilities/eventResponse";
import { noop } from "src/utilities/other";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { AUTH_STATUS } from "src/constants/auth";

// Hooks
import useFetchUserEvents from "src/hooks/useFetchUserEvents";

import { useAuth } from "src/providers/auth";

const now = new Date();

export const getServerSideProps = async context => {
  // TODO: Move this and all auth related to stuff into shared component that wraps page
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID
      }),
      databaseURL: `https://${process.env.FIREBASE_ADMIN_PROJECT_ID}.firebaseio.com`
    });
  }

  let cookies;
  let token;
  let authStatus;

  try {
    cookies = nookies.get(context);
    token = hasToken(cookies)
      ? await firebaseAdmin.auth().verifyIdToken(cookies.token)
      : null;
    authStatus = getAuthStatus(token);
  } catch (err) {
    noop();
  }

  const data = {};

  if (authStatus === AUTH_STATUS.AUTHENTICATED) {
    const { user } = await getUserDetails(token.uid);
    const { school } = await getSchoolDetails(user.school.id);

    data.authUser = {
      email: token.email,
      uid: token.uid
    };
    data.user = user;
    data.school = school;
  }

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Home

const Home = props => {
  const _a = useAuth();

  console.log(_a);
  return (
    <React.Fragment>
      <Head>
        <title>Campus Gaming Network | CGN</title>
      </Head>
      <Box as="article" py={16} px={8} mx="auto" maxW="5xl">
        <Box>
          <Heading size="2xl" mb={8}>
            Campus Gaming Network
          </Heading>
          <Text fontSize="3xl" color="gray.60">
            Connect with other collegiate gamers for casual or competitive
            gaming at your school or nearby.
          </Text>
          <Stack pt={8} spacing={8}>
            {/* <UserCreatedEvents isAuthenticated={isAuthenticated} user={user} />
          <AttendingEvents
            isAuthenticated={isAuthenticated}
            authenticatedUser={authenticatedUser}
          />
          <UpcomingSchoolEvents
            isAuthenticated={isAuthenticated}
            school={school}
          />
          <RecentlyCreatedEvents /> */}
          </Stack>
        </Box>
      </Box>
    </React.Fragment>
  );
};

const UserCreatedEvents = props => {
  const userDocRef = props.user
    ? firebase
        .firestore()
        .collection(COLLECTIONS.USERS)
        .doc(props.user.id)
    : null;
  const [userCreatedEvents, isLoading] = useCollectionDataOnce(
    firebase
      .firestore()
      .collection(COLLECTIONS.EVENTS)
      .where("creator", "==", userDocRef)
      .where("endDateTime", ">=", firebase.firestore.Timestamp.fromDate(now))
      .limit(12)
  );

  if (!props.isAuthenticated || isLoading) {
    return null;
  }

  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Your events
      </Heading>
      {userCreatedEvents && userCreatedEvents.length ? (
        <React.Fragment>
          <List d="flex" flexWrap="wrap" m={-2} p={0}>
            {userCreatedEvents.map(mapEvent).map(event => (
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
  const [attendingEvents, isLoading] = useFetchUserEvents(
    props.isAuthenticated ? props.authenticatedUser.uid : null,
    12
  );

  if (!props.isAuthenticated || isLoading) {
    return null;
  }

  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Events you're attending
      </Heading>
      {attendingEvents && attendingEvents.length ? (
        <React.Fragment>
          <List d="flex" flexWrap="wrap" m={-2} p={0}>
            {attendingEvents.map(mapEventResponse).map(event => (
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
  const schoolDocRef = props.school
    ? firebase
        .firestore()
        .collection(COLLECTIONS.SCHOOLS)
        .doc(props.school.id)
    : null;
  const [schoolEvents, isLoading] = useCollectionDataOnce(
    firebase
      .firestore()
      .collection(COLLECTIONS.EVENTS)
      .where("school.ref", "==", schoolDocRef)
      .where("endDateTime", ">=", firebase.firestore.Timestamp.fromDate(now))
      .limit(12)
  );
  const canDisplay = React.useMemo(
    () => props.isAuthenticated && props.school && props.school.name,
    [props.isAuthenticated, props.school]
  );

  if (!canDisplay || isLoading) {
    return null;
  }

  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Upcoming events at{" "}
        <Link
          href={`/school/${props.school.id}`}
          color="brand.500"
          fontWeight="bold"
          isTruncated
          lineHeight="short"
          mt={-2}
          title={startCase(props.school.name.toLowerCase())}
        >
          {startCase(props.school.name.toLowerCase())}
        </Link>
      </Heading>
      {schoolEvents && schoolEvents.length ? (
        <React.Fragment>
          <List d="flex" flexWrap="wrap" m={-2} p={0}>
            {schoolEvents.map(mapEvent).map(event => (
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
          There are no upcoming events at{" "}
          {startCase(props.school.name.toLowerCase())}
        </Text>
      )}
    </Stack>
  );
};

const RecentlyCreatedEvents = () => {
  const [recentlyCreatedEvents, isLoading] = useCollectionDataOnce(
    firebase
      .firestore()
      .collection(COLLECTIONS.EVENTS)
      .where("endDateTime", ">=", firebase.firestore.Timestamp.fromDate(now))
      .orderBy("endDateTime")
      .orderBy("createdAt", "desc")
      .limit(12)
  );

  if (isLoading) {
    return null;
  }

  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Recently created events
      </Heading>
      {recentlyCreatedEvents && recentlyCreatedEvents.length ? (
        <React.Fragment>
          <List d="flex" flexWrap="wrap" m={-2} p={0}>
            {recentlyCreatedEvents.map(mapEvent).map(event => (
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
