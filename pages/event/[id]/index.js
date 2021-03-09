import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faGlobe,
  faSchool,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
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
import dynamic from 'next/dynamic';
import Head from "next/head";

// Constants
import {
  EVENT_EMPTY_LOCATION_TEXT,
  EVENT_EMPTY_USERS_TEXT
} from "src/constants/event";
import {
  DEFAULT_USERS_LIST_PAGE_SIZE,
  DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE,
  COOKIES
} from "src/constants/other";
import { AUTH_STATUS } from "src/constants/auth";

// Components
import SiteLayout from "src/components/SiteLayout";
import OutsideLink from "src/components/OutsideLink";
import Article from "src/components/Article";
import Link from "src/components/Link";
import GameCover from "src/components/GameCover";

// Providers
import { useAuth } from "src/providers/auth";

// API
import { getEventDetails, getEventUsers } from 'src/api/event';
import { getUserEventResponse } from "src/api/user";

const RSVPDialog = dynamic(() => import('src/components/dialogs/RSVPDialog'), { ssr: false });

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async ({ params }) => {
  const { event } = await getEventDetails(params.id);
  const { users } = await getEventUsers(params.id);

  if (!Boolean(event)) {
    return { notFound: true };
  }

  const data = {
    event,
    users,
    eventResponse: null,
    isEventCreator: false,
    hasResponded: false,
    canChangeEventResponse: false,
  };

  try {
    const cookies = nookies.get(context);
    const token = Boolean(cookies) && Boolean(cookies[COOKIES.AUTH_TOKEN])
      ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
      : null;
      const authStatus = Boolean(token) && Boolean(token.uid) ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED;
    const isEventCreator = event.creator.id === token.uid;
    const { eventResponse } = await getUserEventResponse(params.id, token.uid);
    const canChangeEventResponse = (
      authStatus === AUTH_STATUS.AUTHENTICATED &&
      !isEventCreator &&
      !event.hasEnded
    );

    data.isEventCreator = isEventCreator;
    data.eventResponse = eventResponse;
    data.hasResponded = Boolean(eventResponse);
    data.canChangeEventResponse = canChangeEventResponse;
  } catch (error) {
    noop();
  }

  return { props: JSON.parse(safeJsonStringify(data)) };
}

////////////////////////////////////////////////////////////////////////////////
// Event

const Event = props => {
  const { authUser } = useAuth();
  const [refreshEventResponse, setRefreshEventResponse] = React.useState(false);
  const [isRSVPAlertOpen, setIsRSVPAlertOpen] = React.useState(false);

  const openRSVPDialog = () => {
    setIsRSVPAlertOpen(canChangeEventResponse);
  };
  const closeRSVPDialog = () => {
    setIsRSVPAlertOpen(false);
  };

  return (
    <SiteLayout pageTitle={props.event.name}>
      <Article>
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
                href={`/school/${props.event.school.id}`}
                color="brand.500"
                fontWeight={600}
                fontSize="lg"
              >
                {props.event.school.formattedName}
              </Link>
              <Heading as="h2" fontWeight="bold" fontSize="5xl">
                {props.event.name}
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
                name={Boolean(props.event.game) ? props.event.game.name : null}
                url={
                  Boolean(props.event.game) && Boolean(props.event.game.cover) ? props.event.game.cover.url : null
                }
                h={10}
                w={10}
                mr={2}
              />
              <Text as="span">{props.event.game.name}</Text>
            </Flex>
            {props.event.hasEnded ? (
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
            ) : props.event.hasStarted ? (
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
                dateTime={props.event.startDateTime.toDate()}
                title={props.event.startDateTime.toDate()}
              >
                {props.event.formattedStartDateTime}
              </Text>{" "}
              to{" "}
              <Text
                as="time"
                dateTime={props.event.endDateTime.toDate()}
                title={props.event.endDateTime.toDate()}
              >
                {props.event.formattedEndDateTime}
              </Text>
            </Box>
            <Box>
              {props.event.isOnlineEvent ? (
                <React.Fragment>
                  <Text as="span" mr={2}>
                    <FontAwesomeIcon icon={faGlobe} />
                  </Text>
                  <Text as="span">Online event</Text>
                </React.Fragment>
              ) : Boolean(props.event.location) ? (
                <React.Fragment>
                  <Text as="span" color="gray.600" mr={2} fontSize="lg">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </Text>
                  <OutsideLink
                    d="inline-block"
                    href={props.event.googleMapsAddressLink}
                  >
                    {props.event.location}
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
                  <Text as="span">{props.EVENT_EMPTY_LOCATION_TEXT}</Text>
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
            {Boolean(props.event.description) && props.event.description.trim().length > 0 ? (
              <Text>{props.event.description}</Text>
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
            <UsersList users={props.users} />
          </Stack>
        </Stack>
      </Article>

      {canChangeEventResponse ? (
        <RSVPDialog
          authUser={authUser}
          event={props.event}
          eventResponse={props.eventResponse}
          isOpen={isRSVPAlertOpen}
          onClose={closeRSVPDialog}
          refreshEventResponse={refreshEventResponse}
          setRefreshEventResponse={setRefreshEventResponse}
        />
      ) : null}
    </SiteLayout>
  );
};

////////////////////////////////////////////////////////////////////////////////
// UsersList

const UsersList = props => {
  const [page, setPage] = React.useState(0);
  const hasUsers = React.useMemo(
    () => Boolean(props.users) && props.users.length && props.users.length > 0,
    [props.users]
  );
  const isFirstPage = React.useMemo(() => page === 0, [page]);
  const isLastPage = React.useMemo(
    () => hasUsers && props.users.length === DEFAULT_USERS_LIST_PAGE_SIZE,
    [hasUsers, props.users]
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
          {props.users.map(user => (
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
      {props.EVENT_EMPTY_USERS_TEXT}
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
