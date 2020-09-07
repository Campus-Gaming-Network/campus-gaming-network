import React from "react";
import { firebase, firebaseFirestore, firebaseAuth } from "../firebase";
import { Box, Heading, Text, Stack, List } from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

import EventListItem from "../components/EventListItem";
import { mapEvent, mapEventResponse } from "../utilities";

// Hooks
import useFetchUserEvents from "../hooks/useFetchUserEvents";
// import useFetchRecentlyCreatedEvents from "../hooks/useFetchRecentlyCreatedEvents";

const now = new Date();

const Home = props => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const isAuthenticated = React.useMemo(
    () => !isAuthenticating && !!authenticatedUser,
    [isAuthenticating, authenticatedUser]
  );
  const [attendingEvents] = useFetchUserEvents(
    isAuthenticated ? authenticatedUser.uid : null
  );
  const [recentlyCreatedEvents] = useCollectionDataOnce(
    firebaseFirestore
      .collection("events")
      .where("endDateTime", ">=", firebase.firestore.Timestamp.fromDate(now))
      .orderBy("endDateTime")
      .orderBy("createdAt", "desc")
      .limit(25)
  );

  const test =
    recentlyCreatedEvents && recentlyCreatedEvents.length
      ? recentlyCreatedEvents.map(mapEvent)
      : [];

  console.log({ test });

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
        <Stack pt={8} spacing={10}>
          {isAuthenticated ? (
            <Stack as="section" spacing={4}>
              <Heading
                as="h3"
                fontSize="sm"
                textTransform="uppercase"
                color="gray.500"
              >
                Your upcoming events
              </Heading>
              {attendingEvents && attendingEvents.length ? (
                <React.Fragment>
                  <List d="flex" flexWrap="wrap" m={-2} p={0}>
                    {attendingEvents.map(mapEventResponse).map(event => (
                      <EventListItem key={event.id} {...event} />
                    ))}
                  </List>
                </React.Fragment>
              ) : null}
            </Stack>
          ) : null}
          <Stack as="section" spacing={4}>
            <Heading
              as="h3"
              fontSize="sm"
              textTransform="uppercase"
              color="gray.500"
            >
              Recently created events
            </Heading>
            {test && test.length ? (
              <React.Fragment>
                <List d="flex" flexWrap="wrap" m={-2} p={0}>
                  {test.map(event => (
                    <EventListItem
                      key={event.id}
                      event={event}
                      school={event.schoolDetails}
                    />
                  ))}
                </List>
              </React.Fragment>
            ) : null}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;
