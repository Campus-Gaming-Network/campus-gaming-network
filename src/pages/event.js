import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Gravatar from "react-gravatar";
// TODO: Replace moment with something smaller
import {
  Stack,
  Box,
  Button as ChakraButton,
  Heading,
  Text,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  List,
  ListItem,
  Spinner
} from "@chakra-ui/core";
import * as constants from "../constants";

// Components
import OutsideLink from "../components/OutsideLink";
import Avatar from "../components/Avatar";
import Link from "../components/Link";
import Flex from "../components/Flex";

// Hooks
import useFetchEventDetails from "../hooks/useFetchEventDetails";
import useFetchEventUsers from "../hooks/useFetchEventUsers";

// const CACHED_EVENTS = {};

const Event = props => {
  // const hasCachedEvent = !!CACHED_EVENTS[props.id];
  // const shouldFetchEvent = !hasCachedEvent;
  // const eventFetchId = shouldFetchEvent ? props.id : null;
  const [event, isLoadingFetchedEvent] = useFetchEventDetails(props.id);

  // const event = hasCachedEvent
  //   ? CACHED_EVENTS[props.id]
  //   : eventFetchId
  //   ? fetchedEvent
  //   : null;

  // if (!hasCachedEvent) {
  //   CACHED_EVENTS[props.id] = {
  //     event: null,
  //     users: null,
  //   };
  //   if (event) {
  //     CACHED_EVENTS[props.id] = {...event};
  //   }
  // }

  // console.log(CACHED_EVENTS)

  // const hasCachedEventUsers = !!CACHED_EVENTS[props.id].users;
  // const shouldFetchEventUsers = !hasCachedEventUsers;
  // const usersEventToFetch = shouldFetchEventUsers ? props.id : null;
  const [users, isLoadingEventUsers] = useFetchEventUsers(props.id);

  // const users = hasCachedEventUsers
  //   ? CACHED_EVENTS[props.id].users
  //   : eventUsers;

  // if (eventUsers) {
  //   CACHED_EVENTS[props.id] = {
  //     ...CACHED_EVENTS[props.id],
  //     users: [...eventUsers]
  //   };
  // }

  // const [isCancellationAlertOpen, setCancellationAlertIsOpen] = React.useState(
  //   false
  // );
  // const onCancellationAlertClose = () => setCancellationAlertIsOpen(false);
  // const [isAttendingAlertOpen, setAttendingAlertOpen] = React.useState(false);
  // const onAttendingAlertClose = () => setAttendingAlertOpen(false);
  // const cancelRef = React.useRef();
  // const attendRef = React.useRef();

  // console.log((isLoadingFetchedEvent || (shouldFetchEvent && !event)), event && event.id)

  if (isLoadingFetchedEvent) {
    return (
      <Box w="100%" textAlign="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
          mt={4}
        />
      </Box>
    );
  }

  if (!event) {
    console.error(`No event found ${props.uri}`);
    return <Redirect to="not-found" noThrow />;
  }

  // if (!school) {
  //   console.error(`No school found ${props.uri}`);
  //   return <Redirect to="not-found" noThrow />;
  // }

  const hasResponded = false;

  // function handleAttendSubmit(e) {
  //   e.preventDefault();

  //   setAttendingAlertOpen(true);
  // }

  // function handleCancelSubmit(e) {
  //   e.preventDefault();
  //   setCancellationAlertIsOpen(true);
  // const response = window.confirm(
  //   "Are you sure you want to cancel your RSVP?"
  // );
  // if (response) {
  //   console.log("Confirmed");
  // } else {
  //   console.log("Cancelled");
  // }
  // }

  return (
    <React.Fragment>
      <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
        <Stack spacing={10}>
          <Flex itemsCenter>
            <Box pr={2}>
              {/* <Link
                to={`../../../school/${school.id}`}
                className={`${constants.STYLES.LINK.DEFAULT} text-lg`}
              >
                {school.name}
              </Link> */}
              <Heading as="h1" fontWeight="bold" fontSize="5xl" mb={2}>
                {event.name}
              </Heading>
            </Box>
            {/* <Image
              src={school.logo}
              alt={`${school.name} school logo`}
              className="w-auto ml-auto bg-gray-400 h-24"
            /> */}
          </Flex>
          <Stack as="section">
            <Box>
              <FontAwesomeIcon
                icon={faClock}
                className="text-gray-700 mr-2 text-lg"
              />
              <time dateTime={event.formattedStartDateTime}>
                {event.formattedStartDateTime}
              </time>{" "}
              to{" "}
              <time dateTime={event.formattedEndDateTime}>
                {event.formattedEndDateTime}
              </time>
            </Box>
            <Box>
              {event.isOnlineEvent ? (
                <React.Fragment>
                  <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                  <Text as="span">Online event</Text>
                </React.Fragment>
              ) : event.location ? (
                <React.Fragment>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-gray-700 mr-2 text-lg"
                  />
                  <OutsideLink href={event.googleMapsAddressLink}>
                    {event.location}
                  </OutsideLink>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-gray-700 mr-2 text-lg"
                  />
                  <Text>{constants.EVENT_EMPTY_LOCATION_TEXT}</Text>
                </React.Fragment>
              )}
            </Box>
          </Stack>
          {/* <Stack as="section" spacing={4}>
            {hasResponded ? (
              <form onSubmit={handleAttendSubmit}>
                <ChakraButton type="submit" variantColor="purple">
                  Attend Event
                </ChakraButton>
              </form>
            ) : (
              <form onSubmit={handleCancelSubmit}>
                <Alert
                  status="success"
                  variant="subtle"
                  flexDirection="column"
                  justifyContent="center"
                  textAlign="center"
                  height="100px"
                  rounded="lg"
                >
                  <Stack>
                    <Text fontWeight="bold" fontSize="2xl" color="green.500">
                      You’re going!
                    </Text>
                    <ChakraButton
                      type="submit"
                      variant="link"
                      color="green.500"
                      display="inline"
                    >
                      Cancel your RSVP
                    </ChakraButton>
                  </Stack>
                </Alert>
              </form>
            )}
          </Stack> */}
          <Stack as="section" spacing={4}>
            <Heading
              as="h2"
              fontSize="sm"
              textTransform="uppercase"
              color="gray.500"
            >
              Event Details
            </Heading>
            <p>{event.description}</p>
          </Stack>
          <Stack as="section" spacing={4}>
            <Heading
              as="h4"
              fontSize="sm"
              textTransform="uppercase"
              color="gray.500"
            >
              Attendees
            </Heading>
            {isLoadingEventUsers ? (
              <Box w="100%" textAlign="center">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="purple.500"
                  size="xl"
                  mt={4}
                />
              </Box>
            ) : users && users.length ? (
              <List display="flex" flexWrap="wrap">
                {users.map(user => (
                  <ListItem key={user.id} width="25%">
                    <Box
                      borderWidth="1px"
                      boxShadow="lg"
                      rounded="lg"
                      bg="white"
                      pos="relative"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      m={2}
                      p={4}
                      height="calc(100% - 1rem)"
                    >
                      <Gravatar
                        default={constants.GRAVATAR.DEFAULT}
                        rating={constants.GRAVATAR.RA}
                        md5={user.gravatar}
                        className="rounded-full"
                        size={60}
                      />
                      <Link
                        to={`../../../user/${user.id}`}
                        className={`${constants.STYLES.LINK.DEFAULT} text-base leading-tight`}
                        fontWeight="bold"
                        mt={4}
                      >
                        {user.fullName}
                      </Link>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text mt={4} color="gray.500">
                {constants.EVENT_EMPTY_USERS_TEXT}
              </Text>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* <AlertDialog
        isOpen={isAttendingAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAttendingAlertClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            RSVP
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to RSVP for {event.title}?
          </AlertDialogBody>

          <AlertDialogFooter>
            <ChakraButton ref={attendRef} onClick={onAttendingAlertClose}>
              No, nevermind
            </ChakraButton>
            <ChakraButton
              variantColor="purple"
              onClick={onAttendingAlertClose}
              ml={3}
            >
              Yes, I want to go
            </ChakraButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        isOpen={isCancellationAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCancellationAlertClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Cancel RSVP
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to cancel your RSVP for {event.title}?
          </AlertDialogBody>

          <AlertDialogFooter>
            <ChakraButton ref={cancelRef} onClick={onCancellationAlertClose}>
              No, nevermind
            </ChakraButton>
            <ChakraButton
              variantColor="red"
              onClick={onCancellationAlertClose}
              ml={3}
            >
              Yes, cancel the RSVP
            </ChakraButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </React.Fragment>
  );
};

export default Event;