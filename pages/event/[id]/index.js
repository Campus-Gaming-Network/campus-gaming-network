// Libraries
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faGlobe,
  faSchool,
  faFlag,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
  Stack,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import safeJsonStringify from "safe-json-stringify";
import nookies from "nookies";

// Constants
import {
  EVENT_EMPTY_LOCATION_TEXT,
  EVENT_EMPTY_USERS_TEXT,
} from "src/constants/event";
import { COOKIES } from "src/constants/other";
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
import { getEventDetails, getEventUsers } from "src/api/event";
import { getUserDetails, getUserEventResponse } from "src/api/user";

// Other
import firebaseAdmin from "src/firebaseAdmin";

// Dynamic Components
const ReportEntityDialog = dynamic(
  () => import("src/components/dialogs/ReportEntityDialog"),
  {
    ssr: false,
  }
);
const RSVPDialog = dynamic(() => import("src/components/dialogs/RSVPDialog"), {
  ssr: false,
});
const EventResponseAlert = dynamic(() =>
  import("src/components/EventResponseAlert")
);
const EditEventLink = dynamic(() => import("src/components/EditEventLink"));
const EventResponseAttendButton = dynamic(() =>
  import("src/components/EventResponseAttendButton")
);

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  const [eventDetailsResponse, usersResponse] = await Promise.all([
    getEventDetails(context.params.id),
    getEventUsers(context.params.id),
  ]);
  const { event } = eventDetailsResponse;
  const { users } = usersResponse;

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

  let isEventCreator = false;
  let canChangeEventResponse = false;

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
      const [userResponse, userEventResponse] = await Promise.all([
        getUserDetails(token.uid),
        getUserEventResponse(context.params.id, token.uid),
      ]);
      const { user } = userResponse;
      const { eventResponse } = userEventResponse;

      data.user = user;
      data.eventResponse = eventResponse;
      data.hasResponded = Boolean(eventResponse);

      isEventCreator = event.creator.id === token.uid;
      canChangeEventResponse = !isEventCreator && !event.hasEnded;
    }

    data.isEventCreator = isEventCreator;
    data.canChangeEventResponse = canChangeEventResponse;
  } catch (error) {
    return { notFound: true };
  }

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Event

const Event = (props) => {
  const { authUser, isAuthenticated } = useAuth();
  const [isRSVPAlertOpen, setIsRSVPAlertOpen] = React.useState(false);
  const [
    isReportingUserDialogOpen,
    setReportingUserDialogIsOpen,
  ] = React.useState(false);

  const openReportEntityDialog = () => {
    setReportingUserDialogIsOpen(true);
  };

  const closeReportEntityDialog = () => {
    setReportingUserDialogIsOpen(false);
  };

  const openRSVPDialog = () => {
    setIsRSVPAlertOpen(props.canChangeEventResponse);
  };
  const closeRSVPDialog = () => {
    setIsRSVPAlertOpen(false);
  };

  return (
    <SiteLayout meta={props.event.meta}>
      <Article>
        <Stack spacing={10}>
          {props.isEventCreator ? (
            <EditEventLink eventId={props.event.id} />
          ) : null}
          <Flex align="center" justify="space-between">
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
            {isAuthenticated ? (
              <Box pl={4}>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    size="sm"
                    icon={<FontAwesomeIcon icon={faEllipsisH} />}
                    aria-label="Options"
                  />
                  <MenuList fontSize="md">
                    <MenuItem
                      onClick={openReportEntityDialog}
                      icon={<FontAwesomeIcon icon={faFlag} />}
                    >
                      Report event
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            ) : null}
          </Flex>
          <Stack as="section">
            <Flex align="center" pt={2}>
              <GameCover
                name={Boolean(props.event.game) ? props.event.game.name : null}
                url={
                  Boolean(props.event.game) && Boolean(props.event.game.cover)
                    ? props.event.game.cover.url
                    : null
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
                dateTime={props.event.startDateTime.locale}
                title={props.event.startDateTime.locale}
              >
                {props.event.startDateTime.locale}
              </Text>{" "}
              to{" "}
              <Text
                as="time"
                dateTime={props.event.endDateTime.locale}
                title={props.event.endDateTime.locale}
              >
                {props.event.endDateTime.locale}
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
          {props.canChangeEventResponse ? (
            <Stack as="section" spacing={4}>
              {props.hasResponded && props.eventResponse.response === "YES" ? (
                <EventResponseAlert onClick={openRSVPDialog} />
              ) : (
                <EventResponseAttendButton onClick={openRSVPDialog} />
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
            {Boolean(props.event.description) &&
            props.event.description.trim().length > 0 ? (
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

      {props.canChangeEventResponse ? (
        <RSVPDialog
          user={props.user}
          authUser={authUser}
          event={props.event}
          eventResponse={props.eventResponse}
          isOpen={isRSVPAlertOpen}
          onClose={closeRSVPDialog}
        />
      ) : null}

      {isAuthenticated ? (
        <ReportEntityDialog
          entity={{
            type: "events",
            id: props.event.id,
          }}
          pageProps={props}
          isOpen={isReportingUserDialogOpen}
          onClose={closeReportEntityDialog}
        />
      ) : null}
    </SiteLayout>
  );
};

////////////////////////////////////////////////////////////////////////////////
// UsersList

const UsersList = (props) => {
  const hasUsers = React.useMemo(() => {
    return Boolean(props.users) && props.users.length > 0;
  }, [props.users]);

  if (hasUsers) {
    return (
      <React.Fragment>
        <List display="flex" flexWrap="wrap" mx={-2}>
          {props.users.map((user) => (
            <UsersListItem
              key={user.id}
              id={user.id}
              gravatarUrl={user.gravatarUrl}
              fullName={user.fullName}
            />
          ))}
        </List>
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

const UsersListItem = (props) => {
  return (
    <ListItem w={{ base: "33%", md: "20%" }}>
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
          title={props.fullName}
          src={props.gravatarUrl}
          size="md"
        />
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
