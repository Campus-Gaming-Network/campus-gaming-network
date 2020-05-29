import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faGlobe,
  faSchool,
  faBolt
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import Gravatar from "react-gravatar";
import startCase from "lodash.startcase";
import isEmpty from "lodash.isempty";
import {
  Stack,
  Box,
  Button as ChakraButton,
  Heading,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  List,
  ListItem,
  Spinner,
  Flex,
  PseudoBox,
  useToast
} from "@chakra-ui/core";
import * as constants from "../constants";
import { firebaseFirestore, firebaseAuth } from "../firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";
import { useAuthState } from "react-firebase-hooks/auth";

// Components
import OutsideLink from "../components/OutsideLink";
import Link from "../components/Link";
import EventSilhouette from "../components/EventSilhouette";

// Hooks
import useFetchEventDetails from "../hooks/useFetchEventDetails";
import useFetchEventUsers from "../hooks/useFetchEventUsers";
import useFetchUserEventResponse from "../hooks/useFetchUserEventResponse";

const Event = props => {
  const toast = useToast();
  const cancelRef = React.useRef();
  const attendRef = React.useRef();
  const dispatch = useAppDispatch();
  const state = useAppState();
  const [authenticatedUser] = useAuthState(firebaseAuth);
  const cachedEvent = state.events[props.id];
  const [eventFetchId, setEventFetchId] = React.useState(null);
  const [eventUsersFetchId, setEventUsersFetchId] = React.useState(null);
  const [event, setEvent] = React.useState(state.event);
  const [users, setUsers] = React.useState(state.event.users);
  const [fetchedEvent, isLoadingFetchedEvent] = useFetchEventDetails(
    eventFetchId
  );
  const [fetchedEventUsers, isLoadingFetchedEventUsers] = useFetchEventUsers(
    eventUsersFetchId
  );
  const [refreshEventResponse, setRefreshEventResponse] = React.useState(false);
  const [isEventCreator, setIsEventCreator] = React.useState(false);
  const [userFetchId, setUserFetchId] = React.useState(null);
  const [eventResponse, isLoadingUserEventResponse] = useFetchUserEventResponse(
    props.id,
    userFetchId,
    refreshEventResponse
  );
  const [hasResponded, setHasResponded] = React.useState(false);
  const [canChangeEventResponse, setCanChangeEventResponse] = React.useState(
    false
  );
  const [
    isSubmittingEventResponse,
    setIsSubmittingEventResponse
  ] = React.useState(false);
  const [isCancellationAlertOpen, setCancellationAlertIsOpen] = React.useState(
    false
  );
  const [isAttendingAlertOpen, setAttendingAlertIsOpen] = React.useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = React.useState(true);

  const getEvent = React.useCallback(() => {
    if (!!cachedEvent) {
      setEvent(cachedEvent);
    } else if (!eventFetchId) {
      setEventFetchId(props.id);
    } else if (fetchedEvent) {
      setEvent(fetchedEvent);
      dispatch({
        type: ACTION_TYPES.SET_EVENT,
        payload: fetchedEvent
      });
    }
  }, [props.id, cachedEvent, fetchedEvent, dispatch, eventFetchId]);

  const getEventUsers = React.useCallback(() => {
    if (cachedEvent && cachedEvent.users) {
      setUsers(cachedEvent.users);
    } else if (!eventUsersFetchId) {
      setEventUsersFetchId(props.id);
    } else if (fetchedEventUsers) {
      setUsers(fetchedEventUsers);
      dispatch({
        type: ACTION_TYPES.SET_EVENT_USERS,
        payload: {
          id: props.id,
          users: fetchedEventUsers
        }
      });
    }
  }, [props.id, cachedEvent, fetchedEventUsers, dispatch, eventUsersFetchId]);

  const onCancellationAlertClose = () => setCancellationAlertIsOpen(false);

  const onAttendingAlertCancel = () => setAttendingAlertIsOpen(false);

  React.useEffect(() => {
    if (props.id !== state.event.id) {
      getEvent();
    }
  }, [
    props.id,
    state.event.id,
    cachedEvent,
    fetchedEvent,
    dispatch,
    getEvent,
    isLoadingFetchedEvent
  ]);

  React.useEffect(() => {
    if (!event.users) {
      getEventUsers();
    }
  }, [
    props.id,
    event,
    cachedEvent,
    fetchedEventUsers,
    dispatch,
    getEventUsers
  ]);

  React.useEffect(() => {
    const _isEventCreator =
      authenticatedUser &&
      fetchedEvent &&
      fetchedEvent.creator.id === authenticatedUser.uid;

    if (isEventCreator !== _isEventCreator) {
      setIsEventCreator(_isEventCreator);
    }
  }, [isEventCreator, authenticatedUser, fetchedEvent]);

  React.useEffect(() => {
    const _userFetchId = authenticatedUser ? authenticatedUser.uid : null;

    if (_userFetchId !== userFetchId) {
      setUserFetchId(authenticatedUser.uid);
    }
  }, [isEventCreator, authenticatedUser, userFetchId]);

  React.useEffect(() => {
    const _hasResponded = !!eventResponse;

    if (_hasResponded !== hasResponded) {
      setHasResponded(_hasResponded);
    }
  }, [eventResponse, hasResponded]);

  React.useEffect(() => {
    const _canChangeEventResponse =
      props.isAuthenticated &&
      !isLoadingUserEventResponse &&
      !isEventCreator &&
      fetchedEvent &&
      !fetchedEvent.hasEnded;

    if (_canChangeEventResponse !== canChangeEventResponse) {
      setCanChangeEventResponse(_canChangeEventResponse);
    }
  }, [
    props.isAuthenticated,
    isLoadingUserEventResponse,
    isEventCreator,
    fetchedEvent,
    canChangeEventResponse
  ]);

  React.useEffect(() => {
    const isLoading =
      isLoadingFetchedEvent ||
      isEmpty(event) ||
      isEmpty(state.event) ||
      event.id !== props.id ||
      (event.state && event.state.id !== props.id);

    if (isLoading !== isLoadingEvent) {
      setIsLoadingEvent(isLoading);
    }
  }, [isLoadingFetchedEvent, isLoadingEvent, event, props.id, state.event]);

  const getResponseFormData = response => {
    const userDocRef = firebaseFirestore
      .collection("users")
      .doc(authenticatedUser.uid);
    const eventDocRef = firebaseFirestore.collection("events").doc(event.id);
    const schoolDocRef = firebaseFirestore
      .collection("schools")
      .doc(event.school.id);

    const data = {
      user: userDocRef,
      event: eventDocRef,
      school: schoolDocRef,
      response,
      userDetails: {
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        gravatar: props.user.gravatar
      },
      eventDetails: {
        name: event.name,
        description: event.description,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime
      },
      schoolDetails: {
        name: props.school.name
      }
    };

    return data;
  };

  const onAttendingAlertConfirm = async response => {
    setIsSubmittingEventResponse(true);

    const data = getResponseFormData(response);

    if (!hasResponded) {
      firebaseFirestore
        .collection("event-responses")
        .add(data)
        .then(() => {
          setAttendingAlertIsOpen(false);
          setIsSubmittingEventResponse(false);
          toast({
            title: "RSVP created.",
            description: "Your RSVP has been created.",
            status: "success",
            isClosable: true
          });
          setRefreshEventResponse(!refreshEventResponse);
        })
        .catch(error => {
          setAttendingAlertIsOpen(false);
          setIsSubmittingEventResponse(false);
          toast({
            title: "An error occurred.",
            description: error,
            status: "error",
            isClosable: true
          });
        });
    } else {
      firebaseFirestore
        .collection("event-responses")
        .doc(eventResponse.id)
        .update(data)
        .then(() => {
          if (isCancellationAlertOpen) {
            setCancellationAlertIsOpen(false);
          } else {
            setAttendingAlertIsOpen(false);
          }
          setIsSubmittingEventResponse(false);
          toast({
            title: "RSVP updated.",
            description: "Your RSVP has been updated.",
            status: "success",
            isClosable: true
          });
          setRefreshEventResponse(!refreshEventResponse);
        })
        .catch(error => {
          setAttendingAlertIsOpen(false);
          setIsSubmittingEventResponse(false);
          toast({
            title: "An error occurred.",
            description: error,
            status: "error",
            isClosable: true
          });
        });
    }
  };

  if (isLoadingEvent) {
    return <EventSilhouette />;
  }

  if (!event) {
    console.error(`No event found ${props.uri}`);
    return <Redirect to="../../not-found" noThrow />;
  }

  return (
    <React.Fragment>
      <Box
        as="article"
        mt={10}
        mb={16}
        px={8}
        mx="auto"
        fontSize="xl"
        maxW="4xl"
      >
        <Stack spacing={10}>
          {isEventCreator ? (
            <PseudoBox
              mb={10}
              textAlign="center"
              display="flex"
              justifyContent="center"
            >
              <Link
                to={`/event/${props.id}/edit`}
                className={constants.STYLES.LINK.DEFAULT}
                fontWeight="bold"
                width="100%"
                borderRadius="md"
                bg="gray.100"
                _focus={{ bg: "gray.200", boxShadow: "outline" }}
                _hover={{ bg: "gray.200" }}
                p={8}
              >
                Edit Event
              </Link>
            </PseudoBox>
          ) : null}
          <Flex alignItems="center">
            <Box pr={2}>
              <Link
                to={`../../../school/${event.school.id}`}
                className={`${constants.STYLES.LINK.DEFAULT} text-lg`}
              >
                {startCase(event.schoolDetails.name.toLowerCase())}
              </Link>
              <Heading as="h1" fontWeight="bold" fontSize="5xl">
                {event.name}
              </Heading>
            </Box>
            <Flex
              alignItems="center"
              justifyContent="center"
              color="gray.100"
              h={24}
              w={24}
              bg="gray.400"
              rounded="full"
              border="4px"
              borderColor="gray.300"
              ml="auto"
            >
              <FontAwesomeIcon icon={faSchool} size="2x" />
            </Flex>
          </Flex>
          <Stack as="section">
            {event.hasEnded ? (
              <Flex
                alignItems="center"
                justifyContent="flex-start"
                mr="auto"
                px={4}
                bg="red.100"
                rounded="lg"
              >
                <Text
                  as="span"
                  fontSize="lg"
                  color="red.500"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Event Ended
                </Text>
              </Flex>
            ) : event.hasStarted ? (
              <Flex
                alignItems="center"
                justifyContent="flex-start"
                mr="auto"
                px={4}
                bg="green.100"
                rounded="lg"
              >
                <FontAwesomeIcon
                  size="xs"
                  icon={faBolt}
                  className="pulse text-green-600 mr-2"
                />
                <Text
                  as="span"
                  fontSize="lg"
                  color="green.500"
                  fontWeight="bold"
                  textTransform="uppercase"
                >
                  Happening now
                </Text>
              </Flex>
            ) : null}
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
                  <Text as="span">{constants.EVENT_EMPTY_LOCATION_TEXT}</Text>
                </React.Fragment>
              )}
            </Box>
          </Stack>
          {canChangeEventResponse ? (
            <Stack as="section" spacing={4}>
              {hasResponded && eventResponse.response === "YES" ? (
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
                      onClick={() =>
                        setCancellationAlertIsOpen(
                          !isEventCreator && !event.hasEnded
                        )
                      }
                      variant="link"
                      color="green.500"
                      display="inline"
                    >
                      Cancel your RSVP
                    </ChakraButton>
                  </Stack>
                </Alert>
              ) : (
                <ChakraButton
                  onClick={() =>
                    setAttendingAlertIsOpen(!isEventCreator && !event.hasEnded)
                  }
                  variantColor="purple"
                  w="200px"
                >
                  Attend Event
                </ChakraButton>
              )}
            </Stack>
          ) : null}
          <Stack as="section" spacing={4}>
            <Heading
              as="h2"
              fontSize="sm"
              textTransform="uppercase"
              color="gray.500"
            >
              Event Details
            </Heading>
            <Text>{event.description}</Text>
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
            {isLoadingFetchedEventUsers ? (
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

      {canChangeEventResponse ? (
        <React.Fragment>
          <AlertDialog
            isOpen={isAttendingAlertOpen}
            leastDestructiveRef={cancelRef}
            onClose={onAttendingAlertCancel}
          >
            <AlertDialogOverlay />
            <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                RSVP
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to RSVP for{" "}
                <Text as="span" fontWeight="bold">
                  {event.name}
                </Text>
                ?
              </AlertDialogBody>

              <AlertDialogFooter>
                {isSubmittingEventResponse ? (
                  <ChakraButton variantColor="purple" disabled={true}>
                    RSVPing...
                  </ChakraButton>
                ) : (
                  <React.Fragment>
                    <ChakraButton
                      ref={attendRef}
                      onClick={onAttendingAlertCancel}
                    >
                      No, nevermind
                    </ChakraButton>
                    <ChakraButton
                      variantColor="purple"
                      onClick={() => onAttendingAlertConfirm("YES")}
                      ml={3}
                    >
                      Yes, I want to go
                    </ChakraButton>
                  </React.Fragment>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            isOpen={isCancellationAlertOpen}
            leastDestructiveRef={cancelRef}
            onClose={onCancellationAlertClose}
          >
            <AlertDialogOverlay />
            <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Cancel RSVP
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to cancel your RSVP for{" "}
                <Text as="span" fontWeight="bold">
                  {event.name}
                </Text>
                ?
              </AlertDialogBody>

              <AlertDialogFooter>
                {isSubmittingEventResponse ? (
                  <ChakraButton variantColor="red" disabled={true}>
                    Cancelling...
                  </ChakraButton>
                ) : (
                  <React.Fragment>
                    <ChakraButton
                      ref={cancelRef}
                      onClick={onCancellationAlertClose}
                    >
                      No, nevermind
                    </ChakraButton>
                    <ChakraButton
                      variantColor="red"
                      onClick={() => onAttendingAlertConfirm("NO")}
                      ml={3}
                    >
                      Yes, cancel the RSVP
                    </ChakraButton>
                  </React.Fragment>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default Event;
