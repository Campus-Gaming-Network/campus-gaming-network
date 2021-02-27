import React from "react";
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
  Alert,
  List,
  ListItem,
  Flex,
  Avatar,
  Skeleton
} from "@chakra-ui/react";
import { ArrowBack, ArrowForward } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";

// Constants
import {
  EVENT_EMPTY_LOCATION_TEXT,
  EVENT_EMPTY_USERS_TEXT
} from "src/constants/event";
import {
  DEFAULT_USERS_LIST_PAGE_SIZE,
  DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE
} from "src/constants/other";

// Other
import { firebase } from "src/firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "src/store";

// Components
import OutsideLink from "src/components/OutsideLink";
import Link from "src/components/Link";
import EventSilhouette from "src/components/silhouettes/EventSilhouette";
import GameCover from "src/components/GameCover";

// Hooks
import useFetchEventDetails from "src/hooks/useFetchEventDetails";
import useFetchEventUsers from "src/hooks/useFetchEventUsers";
import useFetchUserEventResponse from "src/hooks/useFetchUserEventResponse";
import RSVPDialog from "src/components/dialogs/RSVPDialog";

////////////////////////////////////////////////////////////////////////////////
// Event

const Event = props => {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const [authenticatedUser] = useAuthState(firebase.auth());
  const [event, isLoadingEvent] = useFetchEventDetails(props.id);
  const [refreshEventResponse, setRefreshEventResponse] = React.useState(false);
  const [isRSVPAlertOpen, setIsRSVPAlertOpen] = React.useState(false);
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

  const openRSVPDialog = () => {
    setIsRSVPAlertOpen(canChangeEventResponse);
  };
  const closeRSVPDialog = () => {
    setIsRSVPAlertOpen(false);
  };

  React.useEffect(() => {
    if (props.id !== state.event.id && !isLoadingEvent) {
      dispatch({
        type: ACTION_TYPES.SET_EVENT,
        payload: event
      });
    }
  }, [props.id, state.event.id, dispatch, event, isLoadingEvent]);

  if (isLoadingEvent) {
    return <EventSilhouette />;
  }

  if (!event || isEmpty(event)) {
    console.error(`No event found ${props.uri}`);
    return <Redirect href="/not-found" noThrow />;
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
            <Box
              mb={10}
              textAlign="center"
              display="flex"
              justifyContent="center"
            >
              <Link
                href={`/event/${props.id}/edit`}
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
            </Box>
          ) : null}
          <Flex alignItems="center">
            <Box pr={2}>
              <Link
                href={`/school/${event.school.id}`}
                color="brand.500"
                fontWeight={600}
                fontSize="lg"
              >
                {startCase(event.school.name.toLowerCase())}
              </Link>
              <Heading as="h2" fontWeight="bold" fontSize="5xl">
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
                      onClick={openRSVPDialog}
                      variant="link"
                      color="green.500"
                      display="inline"
                    >
                      Cancel your RSVP
                    </Button>
                  </Stack>
                </Alert>
              ) : (
                <Button onClick={openRSVPDialog} colorScheme="brand" w="200px">
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
        <RSVPDialog
          event={event}
          eventResponse={eventResponse}
          isOpen={isRSVPAlertOpen}
          onClose={closeRSVPDialog}
          refreshEventResponse={refreshEventResponse}
          setRefreshEventResponse={setRefreshEventResponse}
        />
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
  const hasUsers = React.useMemo(
    () => users && users.length && users.length > 0,
    [users]
  );
  const isFirstPage = React.useMemo(() => page === 0, [page]);
  const isLastPage = React.useMemo(
    () => hasUsers && users.length === DEFAULT_USERS_LIST_PAGE_SIZE,
    [hasUsers, users]
  );
  const isValidPage = React.useMemo(() => page >= 0, [page]);

  const nextPage = () => {
    if (!isLastPage) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (!isFirstPage) {
      setPage(page - 1);
    }
  };

  React.useEffect(() => {
    if (isLoadingUsers && hasUsers && isValidPage) {
      dispatch({
        type: ACTION_TYPES.SET_EVENT_USERS,
        payload: {
          id: props.id,
          users,
          page
        }
      });
    }
  }, [isLoadingUsers, users, hasUsers, dispatch, props.id, page, isValidPage]);

  if (isLoadingUsers) {
    return (
      <Flex flexWrap="wrap" mx={-2}>
        {times(DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE, index => (
          <Box key={index} w={{ md: "20%", sm: "33%" }}>
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

  if (hasUsers) {
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
          {!isFirstPage ? (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowBack />}
              colorScheme="brand"
              disabled={isFirstPage}
              onClick={prevPage}
            >
              Prev Page
            </Button>
          ) : null}
          {!isLastPage ? (
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowForward />}
              colorScheme="brand"
              disabled={isLastPage}
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
    <ListItem w={{ md: "20%", sm: "33%" }}>
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
        <Avatar name={props.fullName} src={props.gravatarUrl} size="md" />
        <Link
          href={`/user/${props.id}`}
          color="brand.500"
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
