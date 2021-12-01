// Libraries
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faGlobe,
  faSchool,
  faFlag,
  faEllipsisH,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
  Stack,
  Box,
  Heading,
  Text,
  List,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useBoolean,
  ButtonGroup,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import safeJsonStringify from "safe-json-stringify";
import nookies from "nookies";

// Constants
import {
  EVENT_EMPTY_LOCATION_TEXT,
  EVENT_EMPTY_USERS_TEXT,
} from "src/constants/event";
import { COOKIES, NOT_FOUND } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";
import OutsideLink from "src/components/OutsideLink";
import Article from "src/components/Article";
import Link from "src/components/Link";
import GameCover from "src/components/GameCover";
import UserListItem from "src/components/UserListItem";
import EmptyText from "src/components/EmptyText";

// Providers
import { useAuth } from "src/providers/auth";

// API
import { getEventDetails, incrementEventPageViews } from "src/api/event";
import { getUserDetails, getUserEventResponse } from "src/api/user";

// Hooks
import useFetchEventUsers from "src/hooks/useFetchEventUsers";

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
const Time = dynamic(() => import("src/components/Time"), {
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
  const [eventDetailsResponse] = await Promise.all([
    getEventDetails(context.params.id),
    incrementEventPageViews(context.params.id),
  ]);
  const { event } = eventDetailsResponse;

  if (!Boolean(event)) {
    return NOT_FOUND;
  }

  const data = {
    params: context.params,
    event,
    eventResponse: null,
    isEventCreator: false,
    hasResponded: false,
    canChangeEventResponse: false,
  };

  let isEventCreator = false;
  let canChangeEventResponse = false;

  try {
    const cookies = nookies.get(context);
    const token = Boolean(cookies?.[COOKIES.AUTH_TOKEN])
      ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
      : null;

    if (Boolean(token?.uid)) {
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
    return NOT_FOUND;
  }

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Event

const Event = (props) => {
  const { authUser, isAuthenticated } = useAuth();
  const [isRSVPAlertOpen, setIsRSVPAlertOpen] = useBoolean();
  const [
    isReportingEventDialogOpen,
    setReportingEventDialogIsOpen,
  ] = useBoolean();

  const openRSVPDialog = () => {
    if (props.canChangeEventResponse) {
      setIsRSVPAlertOpen.on();
    } else {
      setIsRSVPAlertOpen.off();
    }
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
                      onClick={setReportingEventDialogIsOpen.on}
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
              <Time dateTime={props.event.startDateTime} /> to{" "}
              <Time dateTime={props.event.endDateTime} />
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
            <Heading as="h3" fontSize="xl">
              Event Details
            </Heading>
            {Boolean(props.event.description) &&
            props.event.description.trim().length > 0 ? (
              <Text>{props.event.description}</Text>
            ) : (
              <EmptyText>No event description provided</EmptyText>
            )}
          </Stack>
          <UsersList event={props.event} />
        </Stack>
      </Article>

      {props.canChangeEventResponse ? (
        <RSVPDialog
          user={props.user}
          authUser={authUser}
          event={props.event}
          eventResponse={props.eventResponse}
          isOpen={isRSVPAlertOpen}
          onClose={setIsRSVPAlertOpen.off}
        />
      ) : null}

      {isAuthenticated ? (
        <ReportEntityDialog
          entity={{
            type: "events",
            id: props.event.id,
          }}
          pageProps={props}
          isOpen={isReportingEventDialogOpen}
          onClose={setReportingEventDialogIsOpen.off}
        />
      ) : null}
    </SiteLayout>
  );
};

////////////////////////////////////////////////////////////////////////////////
// UsersList

const UsersList = (props) => {
  const [page, setPage] = React.useState(0);
  const [users, status] = useFetchEventUsers(props.event.id, page);
  const hasUsers = React.useMemo(() => {
    return Boolean(users) && users.length > 0;
  }, [users]);

  const disablePrev = page === 0;
  const disableNext = Math.floor(props.event.responses.yes / 25) === page;

  const decPage = () => {
    if (disablePrev) {
      return;
    }
    setPage(page - 1);
  };
  const incPage = () => {
    if (disableNext) {
      return;
    }
    setPage(page + 1);
  };

  return (
    <Stack as="section" spacing={4}>
      <Flex justify="space-between">
        <Heading as="h4" fontSize="xl">
          Attendees ({props.event.responses.yes})
        </Heading>
        <ButtonGroup size="sm" isAttached variant="outline">
          <IconButton
            onClick={decPage}
            disabled={disablePrev}
            aria-label="Previous page"
            icon={<FontAwesomeIcon icon={faChevronLeft} />}
          />
          <IconButton
            onClick={incPage}
            disabled={disableNext}
            aria-label="Next page"
            icon={<FontAwesomeIcon icon={faChevronRight} />}
          />
        </ButtonGroup>
      </Flex>
      {/* TODO: Better loading here */}
      {status === "loading" ? (
        <Text>Loading...</Text>
      ) : hasUsers ? (
        <List display="flex" flexWrap="wrap" mx={-2}>
          {users.map((user) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </List>
      ) : (
        <EmptyText mt={4}>{EVENT_EMPTY_USERS_TEXT}</EmptyText>
      )}
    </Stack>
  );
};

export default Event;
