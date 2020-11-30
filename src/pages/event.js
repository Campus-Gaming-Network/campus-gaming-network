import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faGlobe,
  faSchool,
  faExternalLinkAlt
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
  useToast,
  Avatar,
  Skeleton
} from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";

// Constants
import {
  EVENT_EMPTY_LOCATION_TEXT,
  DEFAULT_USERS_LIST_PAGE_SIZE,
  DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE,
  EVENT_EMPTY_USERS_TEXT,
  COLLECTIONS
} from "../constants";

// Other
import { firebaseFirestore, firebaseAuth } from "../firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";

// Components
import OutsideLink from "components/OutsideLink";
import Link from "components/Link";
import EventSilhouette from "components/EventSilhouette";
import GameCover from "components/GameCover";

// Hooks
import useFetchEventDetails from "hooks/useFetchEventDetails";
import useFetchEventUsers from "hooks/useFetchEventUsers";
import useFetchUserEventResponse from "hooks/useFetchUserEventResponse";

////////////////////////////////////////////////////////////////////////////////
// Event

const Event = props => {
  const toast = useToast();
  const cancelRef = React.useRef();
  const attendRef = React.useRef();
  const dispatch = useAppDispatch();
  const state = useAppState();
  const [authenticatedUser] = useAuthState(firebaseAuth);
  const [event, isLoadingEvent] = useFetchEventDetails(props.id);
  const [refreshEventResponse, setRefreshEventResponse] = React.useState(false);

  const [
    isSubmittingEventResponse,
    setIsSubmittingEventResponse
  ] = React.useState(false);
  const [isCancellationAlertOpen, setCancellationAlertIsOpen] = React.useState(
    false
  );
  const [isAttendingAlertOpen, setAttendingAlertIsOpen] = React.useState(false);
  const isEventCreator = React.useMemo(
    () =>
      authenticatedUser && event && event.creator.id === authenticatedUser.uid,
    [authenticatedUser, event]
  );
  const [eventResponse, isLoadingUserEventResponse] = useFetchUserEventResponse(
    props.id,
    authenticatedUser && !isEventCreator ? authenticatedUser.uid : null,
    refreshEventResponse
  );
  const hasResponded = React.useMemo(() => !!eventResponse, [eventResponse]);
  const canChangeEventResponse = React.useMemo(
    () =>
      !!authenticatedUser &&
      !isLoadingUserEventResponse &&
      !isEventCreator &&
      !!event &&
      !event.hasEnded,
    [authenticatedUser, isLoadingUserEventResponse, isEventCreator, event]
  );

  const onCancellationAlertClose = () => setCancellationAlertIsOpen(false);

  const onAttendingAlertCancel = () => setAttendingAlertIsOpen(false);

  React.useEffect(() => {
    if (props.id !== state.event.id && !isLoadingEvent) {
      dispatch({
        type: ACTION_TYPES.SET_EVENT,
        payload: event
      });
    }
  }, [props.id, state.event.id, dispatch, event, isLoadingEvent]);

  const getResponseFormData = response => {
    const userDocRef = firebaseFirestore
      .collection(COLLECTIONS.USERS)
      .doc(authenticatedUser.uid);
    const eventDocRef = firebaseFirestore
      .collection(COLLECTIONS.EVENTS)
      .doc(event.id);
    const schoolDocRef = firebaseFirestore
      .collection(COLLECTIONS.SCHOOLS)
      .doc(event.school.id);
    const user = state.users[authenticatedUser.uid];

    const data = {
      response,
      user: {
        ref: userDocRef,
        firstName: user.firstName,
        lastName: user.lastName,
        gravatar: user.gravatar
      },
      event: {
        ref: eventDocRef,
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
      school: {
        ref: schoolDocRef,
        name: event.school.name
      }
    };

    return data;
  };

  const onAttendingAlertConfirm = async response => {
    setIsSubmittingEventResponse(true);

    const data = getResponseFormData(response);

    if (!hasResponded) {
      firebaseFirestore
        .collection(COLLECTIONS.EVENT_RESPONSES)
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
            description: error.message,
            status: "error",
            isClosable: true
          });
        });
    } else {
      firebaseFirestore
        .collection(COLLECTIONS.EVENT_RESPONSES)
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
            description: error.message,
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
        pt={10}
        pb={16}
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
                color="orange.500"
                fontWeight={600}
                fontSize="lg"
              >
                {startCase(event.school.name.toLowerCase())}
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
              <GameCover
                name={event.game ? event.game.name : null}
                url={
                  event.game && event.game.cover ? event.game.cover.url : null
                }
                h={10}
                w={10}
                mr={2}
              />
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
              <Text
                as="time"
                dateTime={event.startDateTime.toDate()}
                title={event.startDateTime.toDate()}
              >
                {event.formattedStartDateTime}
              </Text>{" "}
              to{" "}
              <Text
                as="time"
                dateTime={event.endDateTime.toDate()}
                title={event.endDateTime.toDate()}
              >
                {event.formattedEndDateTime}
              </Text>
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
                  <OutsideLink
                    d="inline-block"
                    href={event.googleMapsAddressLink}
                  >
                    {event.location}
                    <Text as="span" ml={2}>
                      <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                    </Text>
                  </OutsideLink>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Text as="span" color="gray.600" mr={2} fontSize="lg">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </Text>
                  <Text as="span">{EVENT_EMPTY_LOCATION_TEXT}</Text>
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
                  variantColor="orange"
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
            {event.description && event.description.trim().length > 0 ? (
              <Text>{event.description}</Text>
            ) : (
              <Text color="gray.400">No event description provided</Text>
            )}
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
            <UsersList id={props.id} />
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
                  <Button variantColor="orange" disabled={true}>
                    RSVPing...
                  </Button>
                ) : (
                  <React.Fragment>
                    <Button ref={attendRef} onClick={onAttendingAlertCancel}>
                      No, nevermind
                    </Button>
                    <Button
                      variantColor="orange"
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
  const [page, setPage] = React.useState(0);
  const [users, isLoadingUsers] = useFetchEventUsers(props.id, undefined, page);

  const nextPage = () => {
    if (users && users.length === DEFAULT_USERS_LIST_PAGE_SIZE) {
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
          id: props.id,
          users,
          page
        }
      });
    }
  }, [isLoadingUsers, users, dispatch, props.id, page]);

  if (isLoadingUsers) {
    return (
      <Flex flexWrap="wrap" mx={-2}>
        {times(DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE, index => (
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

  if (users && users.length && users.length > 0) {
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
              variantColor="orange"
              disabled={page === 0}
              onClick={prevPage}
            >
              Prev Page
            </Button>
          ) : null}
          {users &&
          users.length &&
          users.length === DEFAULT_USERS_LIST_PAGE_SIZE ? (
            <Button
              variant="ghost"
              size="sm"
              rightIcon="arrow-forward"
              variantColor="orange"
              disabled={users.length !== DEFAULT_USERS_LIST_PAGE_SIZE}
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
      {EVENT_EMPTY_USERS_TEXT}
    </Text>
  );
};

////////////////////////////////////////////////////////////////////////////////
// UsersListItem

const UsersListItem = props => {
  return (
    <ListItem w={{ md: "20%", sm: "33%", xs: "50%" }}>
      <Box
        shadow="sm"
        borderWidth={1}
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
          name={props.fullName}
          src={props.gravatarUrl}
          alt={`The profile picture for ${props.fullName}`}
          title={`The profile picture for ${props.fullName}`}
          h={60}
          w={60}
          rounded="full"
          bg="white"
        />
        <Link
          to={`/user/${props.id}`}
          color="orange.500"
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
