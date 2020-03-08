import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import maxBy from "lodash.maxby";
// TODO: Replace moment with something smaller
import moment from "moment";
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
  ListItem
} from "@chakra-ui/core";
import TEST_DATA from "../test_data";
import * as constants from "../constants";
import { getEventResponses, getEventGoers } from "../utilities";
import OutsideLink from "../components/OutsideLink";
import Avatar from "../components/Avatar";
import Link from "../components/Link";
import Flex from "../components/Flex";

const Event = props => {
  const [isCancellationAlertOpen, setCancellationAlertIsOpen] = React.useState(
    false
  );
  const onCancellationAlertClose = () => setCancellationAlertIsOpen(false);
  const [isAttendingAlertOpen, setAttendingAlertOpen] = React.useState(false);
  const onAttendingAlertClose = () => setAttendingAlertOpen(false);
  const cancelRef = React.useRef();
  const attendRef = React.useRef();

  const event = TEST_DATA.events.find(event => event.id === props.id);

  if (!event) {
    // TODO: Handle gracefully
    console.log("no event");
    return null;
  }

  const school = TEST_DATA.schools[event.schoolId];

  if (!school) {
    // TODO: Handle gracefully
    console.log("no school");
    return null;
  }

  const eventResponses = getEventResponses(event.index);

  const eventGoers = getEventGoers(eventResponses);

  const hasResponded = TEST_DATA.event_responses.some(
    eventResponse =>
      eventResponse.userId === constants.TEST_USER.index &&
      eventResponse.id === event.id
  );

  function handleAttendSubmit(e) {
    e.preventDefault();

    setAttendingAlertOpen(true);

    if (!hasResponded) {
      const maxIndex = maxBy(TEST_DATA.event_responses, "index").index;

      TEST_DATA.event_responses = [
        ...TEST_DATA.event_responses,
        [
          {
            id: Math.random(),
            index: maxIndex + 1,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            eventId: event.index,
            userId: constants.TEST_USER.index,
            response: "YES"
          }
        ]
      ];
    }
  }

  function handleCancelSubmit(e) {
    e.preventDefault();
    setCancellationAlertIsOpen(true);
    // const response = window.confirm(
    //   "Are you sure you want to cancel your RSVP?"
    // );
    // if (response) {
    //   console.log("Confirmed");
    // } else {
    //   console.log("Cancelled");
    // }
  }

  console.log(TEST_DATA);

  return (
    <React.Fragment>
      <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
        <Stack spacing={10}>
          <Flex itemsCenter>
            <Box pr={2}>
              <Link
                to={`../../../school/${school.id}`}
                className={`${constants.STYLES.LINK.DEFAULT} text-lg`}
              >
                {school.name}
              </Link>
              <Heading as="h1" fontWeight="bold" fontSize="5xl" mb={2}>
                {event.title}
              </Heading>
            </Box>
            <Image
              src={school.logo}
              alt={`${school.name} school logo`}
              className="w-auto ml-auto bg-gray-400 h-24"
            />
          </Flex>
          <Stack as="section">
            <Box>
              <FontAwesomeIcon
                icon={faClock}
                className="text-gray-700 mr-2 text-lg"
              />
              <time dateTime={event.startDateTime}>
                {moment(event.startDateTime).calendar(
                  null,
                  constants.MOMENT_CALENDAR_FORMAT
                )}
              </time>{" "}
              to{" "}
              <time dateTime={event.endDateTime}>
                {moment(event.endDateTime).calendar(
                  null,
                  constants.MOMENT_CALENDAR_FORMAT
                )}
              </time>
            </Box>
            <Box>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-gray-700 mr-2 text-lg"
              />
              {event.location ? (
                <OutsideLink
                  href={`${constants.GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(
                    event.location
                  )}`}
                >
                  {event.location}
                </OutsideLink>
              ) : (
                <Text>To be determined</Text>
              )}
            </Box>
          </Stack>
          <Stack as="section" spacing={4}>
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
          </Stack>
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
            {eventResponses.length ? (
              <Heading
                as="h4"
                fontSize="sm"
                textTransform="uppercase"
                color="gray.500"
              >
                Going ({eventResponses.length})
              </Heading>
            ) : null}
            <List display="flex" flexWrap="wrap">
              {eventGoers.map(user => (
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
                    <Avatar
                      src={user.picture}
                      alt={`Avatar for ${user.fullName}`}
                      rounded
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
          </Stack>
        </Stack>
      </Box>

      <AlertDialog
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
      </AlertDialog>
    </React.Fragment>
  );
};

export default Event;
