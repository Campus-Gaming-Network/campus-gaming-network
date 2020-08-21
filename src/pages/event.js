import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faGlobe,
  faSchool,
  faBolt,
  faGamepad
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import startCase from "lodash.startcase";
import isEmpty from "lodash.isempty";
import times from "lodash.times";
import {
  Stack,
  Box,
  Button,
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
  Flex,
  PseudoBox,
  Image,
  useToast,
  Avatar,
  Skeleton
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
  const [event, setEvent] = React.useState(state.event);
  const [fetchedEvent, isLoadingFetchedEvent] = useFetchEventDetails(
    eventFetchId
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
      !!authenticatedUser &&
      !isLoadingUserEventResponse &&
      !isEventCreator &&
      !!fetchedEvent &&
      !fetchedEvent.hasEnded;

    if (_canChangeEventResponse !== canChangeEventResponse) {
      setCanChangeEventResponse(_canChangeEventResponse);
    }
  }, [
    authenticatedUser,
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
    const user = state.users[authenticatedUser.uid];
    const school = state.schools[user.school.id];

    const data = {
      user: userDocRef,
      event: eventDocRef,
      school: schoolDocRef,
      response,
      userDetails: {
        firstName: user.firstName,
        lastName: user.lastName,
        gravatar: user.gravatar
      },
      eventDetails: {
        name: event.name,
        description: event.description,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        isOnlineEvent: event.isOnlineEvent,
        responses: {
          yes: 1,
          no: 0
        }
      },
      schoolDetails: {
        name: school.name
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
            description: JSON.stringify(error),
            status: "error",
            isClosable: true
          });
        });
    } else {
      firebaseFirestore
        .collection("event-responses")
        .doc(eventResponse.id)
        .update({ response })
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
          if (isCancellationAlertOpen) {
            setCancellationAlertIsOpen(false);
          } else {
            setAttendingAlertIsOpen(false);
          }
          setIsSubmittingEventResponse(false);
          toast({
            title: "An error occurred.",
            description: JSON.stringify(error),
            status: "error",
            isClosable: true
          });
        });
    }
  };

  if (isLoadingEvent) {
    return <EventSilhouette />;
  }

  if (!event || isEmpty(event)) {
    console.error(`No event found ${props.uri}`);
    return <Redirect to="/not-found" noThrow />;
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
        maxW="5xl"
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
                to={`/school/${event.school.id}`}
                color="purple.500"
                fontWeight={600}
                fontSize="lg"
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
              ml="auto"
            >
              <FontAwesomeIcon icon={faSchool} size="2x" />
            </Flex>
          </Flex>
          <Stack as="section">
            <Flex align="center" pt={2}>
              {event.game.cover && event.game.cover.url ? (
                <Image
                  src={event.game.cover.url}
                  rounded="lg"
                  shadow="md"
                  h={10}
                  w={10}
                  mr={2}
                />
              ) : (
                <Box mr={2}>
                  <FontAwesomeIcon icon={faGamepad} />
                </Box>
              )}
              <Text as="span">{event.game.name}</Text>
            </Flex>
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
                <Text mr={2} color="green.600">
                  <FontAwesomeIcon size="xs" icon={faBolt} className="pulse" />
                </Text>
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
              <Text as="span" color="gray.600" mr={2} fontSize="lg">
                <FontAwesomeIcon icon={faClock} />
              </Text>
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
                  <Text as="span" mr={2}>
                    <FontAwesomeIcon icon={faGlobe} />
                  </Text>
                  <Text as="span">Online event</Text>
                </React.Fragment>
              ) : event.location ? (
                <React.Fragment>
                  <Text as="span" color="gray.600" mr={2} fontSize="lg">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </Text>
                  <OutsideLink href={event.googleMapsAddressLink}>
                    {event.location}
                  </OutsideLink>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Text as="span" color="gray.600" mr={2} fontSize="lg">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </Text>
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
                    <Button
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
                    </Button>
                  </Stack>
                </Alert>
              ) : (
                <Button
                  onClick={() =>
                    setAttendingAlertIsOpen(!isEventCreator && !event.hasEnded)
                  }
                  variantColor="purple"
                  w="200px"
                >
                  Attend Event
                </Button>
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
            <UsersList eventId={props.id} />
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
                  <Button variantColor="purple" disabled={true}>
                    RSVPing...
                  </Button>
                ) : (
                  <React.Fragment>
                    <Button ref={attendRef} onClick={onAttendingAlertCancel}>
                      No, nevermind
                    </Button>
                    <Button
                      variantColor="purple"
                      onClick={() => onAttendingAlertConfirm("YES")}
                      ml={3}
                    >
                      Yes, I want to go
                    </Button>
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
                  <Button variantColor="red" disabled={true}>
                    Cancelling...
                  </Button>
                ) : (
                  <React.Fragment>
                    <Button ref={cancelRef} onClick={onCancellationAlertClose}>
                      No, nevermind
                    </Button>
                    <Button
                      variantColor="red"
                      onClick={() => onAttendingAlertConfirm("NO")}
                      ml={3}
                    >
                      Yes, cancel the RSVP
                    </Button>
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

////////////////////////////////////////////////////////////////////////////////
// UsersList

const UsersList = props => {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const event = React.useMemo(() => state.events[props.eventId], [
    state.events,
    props.eventId
  ]);
  const [page, setPage] = React.useState(0);
  const [users, isLoadingUsers] = useFetchEventUsers(
    props.eventId,
    undefined,
    page
  );

  const nextPage = () => {
    if (users.length === constants.DEFAULT_USERS_LIST_PAGE_SIZE) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  React.useEffect(() => {
    if (isLoadingUsers && users && page >= 0) {
      dispatch({
        type: ACTION_TYPES.SET_EVENT_USERS,
        payload: {
          id: event.id,
          users,
          page
        }
      });
    }
  }, [isLoadingUsers, users, dispatch, event.id, page]);

  if (isLoadingUsers) {
    return (
      <Flex flexWrap="wrap" mx={-2}>
        {times(constants.DEFAULT_USERS_LIST_PAGE_SIZE, index => (
          <Box key={index} w={{ md: "20%", sm: "33%", xs: "50%" }}>
            <Skeleton
              pos="relative"
              d="flex"
              m={2}
              p={4}
              h={130}
              rounded="lg"
            />
          </Box>
        ))}
      </Flex>
    );
  }

  if (users && users.length) {
    return (
      <React.Fragment>
        <List display="flex" flexWrap="wrap" mx={-2}>
          {users.map(user => (
            <UsersListItem
              key={user.id}
              id={user.id}
              gravatarUrl={user.gravatarUrl}
              fullName={user.fullName}
            />
          ))}
        </List>
        <Flex justifyContent="space-between" m={2}>
          {page > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              leftIcon="arrow-back"
              variantColor="purple"
              disabled={page === 0}
              onClick={prevPage}
            >
              Prev Page
            </Button>
          ) : null}
          {users &&
          users.length &&
          users.length === constants.DEFAULT_USERS_LIST_PAGE_SIZE ? (
            <Button
              variant="ghost"
              size="sm"
              rightIcon="arrow-forward"
              variantColor="purple"
              disabled={users.length !== constants.DEFAULT_USERS_LIST_PAGE_SIZE}
              onClick={nextPage}
              ml="auto"
            >
              Next Page
            </Button>
          ) : null}
        </Flex>
      </React.Fragment>
    );
  }

  return (
    <Text mt={4} color="gray.400">
      {constants.EVENT_EMPTY_USERS_TEXT}
    </Text>
  );
};

////////////////////////////////////////////////////////////////////////////////
// UsersListItem

const UsersListItem = props => {
  return (
    <ListItem w={{ md: "20%", sm: "33%", xs: "50%" }}>
      <Box
        borderWidth="1px"
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
        <Avatar
          name={props.fullname}
          src={props.gravatarUrl}
          h={60}
          w={60}
          rounded="full"
          bg="white"
        />
        <Link
          to={`/user/${props.id}`}
          color="purple.500"
          fontWeight="bold"
          mt={4}
          fontSize="sm"
          lineHeight="1.2"
          textAlign="center"
        >
          {props.fullName}
        </Link>
      </Box>
    </ListItem>
  );
};

export default Event;
