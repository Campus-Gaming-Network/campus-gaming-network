import React from "react";
import { firebase, firebaseFirestore, firebaseAuth } from "../firebase";
import { Box, Heading, Text, Stack, List } from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import startCase from "lodash.startcase";

import Link from "../components/Link";
import EventListItem from "../components/EventListItem";
import { mapEvent, mapEventResponse } from "../utilities";
import { useAppState } from "../store";

// Hooks
import useFetchUserEvents from "../hooks/useFetchUserEvents";

const now = new Date();

// const showPosition = (position) => {
//   console.log({ position })
// };

// const getLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else {
//     console.error("Geolocation is not supported by this browser.");
//   }
// };

////////////////////////////////////////////////////////////////////////////////
// There is a lot to do here to make this better
// I just wanted to add some stuff so it isn't completely
// empty and useless.

const Home = () => {
  const state = useAppState();
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const isAuthenticated = React.useMemo(
    () => !isAuthenticating && !!authenticatedUser,
    [isAuthenticating, authenticatedUser]
  );
  const user = React.useMemo(
    () => (authenticatedUser ? state.users[authenticatedUser.uid] : null),
    [authenticatedUser, state.users]
  );
  const school = React.useMemo(
    () =>
      user && user.school && user.school.id
        ? state.schools[user.school.id]
        : null,
    [user, state.schools]
  );
  const userDocRef = user
    ? firebaseFirestore.collection("users").doc(user.id)
    : null;
  const schoolDocRef = school
    ? firebaseFirestore.collection("schools").doc(school.id)
    : null;
  const [schoolEvents] = useCollectionDataOnce(
    firebaseFirestore
      .collection("events")
      .where("school", "==", schoolDocRef)
      .where("endDateTime", ">=", firebase.firestore.Timestamp.fromDate(now))
      .limit(12)
  );

  const [attendingEvents] = useFetchUserEvents(
    isAuthenticated ? authenticatedUser.uid : null,
    12
  );
  const [recentlyCreatedEvents] = useCollectionDataOnce(
    firebaseFirestore
      .collection("events")
      .where("endDateTime", ">=", firebase.firestore.Timestamp.fromDate(now))
      .orderBy("endDateTime")
      .orderBy("createdAt", "desc")
      .limit(12)
  );
  const [yourEvents] = useCollectionDataOnce(
    firebaseFirestore
      .collection("events")
      .where("creator", "==", userDocRef)
      .where("endDateTime", ">=", firebase.firestore.Timestamp.fromDate(now))
      .limit(12)
  );

  // React.useEffect(() => {
  //   getLocation();
  // }, []);

  return (
    <Box as="article" py={16} px={8} mx="auto" maxW="5xl">
      <Box>
        <Heading size="2xl" mb={8}>
          Campus Gaming Network
        </Heading>
        <Text fontSize="3xl" color="gray.60">
          Connect with other collegiate gamers for casual or competitive gaming
          at your school or nearby.
        </Text>
        <Stack pt={8} spacing={8}>
          {isAuthenticated ? (
            <Stack as="section" spacing={2} py={4}>
              <Heading as="h3" fontSize="xl" pb={4}>
                Your events
              </Heading>
              {yourEvents && yourEvents.length ? (
                <React.Fragment>
                  <List d="flex" flexWrap="wrap" m={-2} p={0}>
                    {yourEvents.map(mapEvent).map(event => (
                      <EventListItem
                        key={event.id}
                        event={event}
                        school={event.schoolDetails}
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
          ) : null}

          {isAuthenticated ? (
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
          ) : null}

          {isAuthenticated && school && school.name ? (
            <Stack as="section" spacing={2} py={4}>
              <Heading as="h3" fontSize="xl" pb={4}>
                Upcoming events at{" "}
                <Link
                  to={`/school/${school.id}`}
                  color="purple.500"
                  fontWeight="bold"
                  isTruncated
                  lineHeight="short"
                  mt={-2}
                  title={startCase(school.name.toLowerCase())}
                >
                  {startCase(school.name.toLowerCase())}
                </Link>
              </Heading>
              {schoolEvents && schoolEvents.length ? (
                <React.Fragment>
                  <List d="flex" flexWrap="wrap" m={-2} p={0}>
                    {schoolEvents.map(mapEvent).map(event => (
                      <EventListItem
                        key={event.id}
                        event={event}
                        school={event.schoolDetails}
                      />
                    ))}
                  </List>
                </React.Fragment>
              ) : (
                <Text color="gray.400" fontSize="xl" fontWeight="600">
                  There are no upcoming events at{" "}
                  {startCase(school.name.toLowerCase())}
                </Text>
              )}
            </Stack>
          ) : null}

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
                      school={event.schoolDetails}
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
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;
