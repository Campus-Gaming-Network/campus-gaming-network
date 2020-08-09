import React from "react";
import { Redirect } from "@reach/router";
import startCase from "lodash.startcase";
import {
  Stack,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Spinner,
  Flex,
  Avatar
} from "@chakra-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import Gravatar from "react-gravatar";
import isEmpty from "lodash.isempty";
import * as constants from "../constants";

import OutsideLink from "../components/OutsideLink";
import VisuallyHidden from "../components/VisuallyHidden";
import Link from "../components/Link";
import EventListItem from "../components/EventListItem";
import SchoolLogo from "../components/SchoolLogo";
import SchoolSilhouette from "../components/SchoolSilhouette";

import useFetchSchoolDetails from "../hooks/useFetchSchoolDetails";
import useFetchSchoolEvents from "../hooks/useFetchSchoolEvents";
import useFetchSchoolUsers from "../hooks/useFetchSchoolUsers";
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "../firebase";
import { isUrl } from "../utilities";

////////////////////////////////////////////////////////////////////////////////
// School

const School = props => {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const cachedSchool = state.schools[props.id];
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [schoolFetchId, setSchoolFetchId] = React.useState(null);
  const [schoolEventsFetchId, setSchoolEventsFetchId] = React.useState(null);
  const [schoolUsersFetchId, setSchoolUsersFetchId] = React.useState(null);
  const [school, setSchool] = React.useState(state.school);
  const [events, setEvents] = React.useState(state.school.events);
  const [users, setUsers] = React.useState(state.school.users);
  const [fetchedSchool, isLoadingFetchedSchool] = useFetchSchoolDetails(
    schoolFetchId
  );
  const [
    fetchedSchoolEvents,
    isLoadingFetchedSchoolEvents
  ] = useFetchSchoolEvents(schoolEventsFetchId);
  const [fetchedSchoolUsers, isLoadingFetchedSchoolUsers] = useFetchSchoolUsers(
    schoolUsersFetchId
  );

  const getSchool = React.useCallback(() => {
    if (cachedSchool) {
      setSchool(cachedSchool);
    } else if (!schoolFetchId) {
      setSchoolFetchId(props.id);
    } else if (fetchedSchool) {
      setSchool(fetchedSchool);
      dispatch({
        type: ACTION_TYPES.SET_SCHOOL,
        payload: fetchedSchool
      });
    }
  }, [props.id, cachedSchool, fetchedSchool, dispatch, schoolFetchId]);

  const getSchoolEvents = React.useCallback(() => {
    if (cachedSchool && cachedSchool.events) {
      setEvents(cachedSchool.events);
    } else if (!schoolEventsFetchId) {
      setSchoolEventsFetchId(props.id);
    } else if (fetchedSchoolEvents) {
      setEvents(fetchedSchoolEvents);
      dispatch({
        type: ACTION_TYPES.SET_SCHOOL_EVENTS,
        payload: {
          id: props.id,
          events: fetchedSchoolEvents
        }
      });
    }
  }, [
    props.id,
    cachedSchool,
    fetchedSchoolEvents,
    dispatch,
    schoolEventsFetchId
  ]);

  const getSchoolUsers = React.useCallback(() => {
    if (cachedSchool && cachedSchool.users) {
      setUsers(cachedSchool.users);
    } else if (!schoolUsersFetchId) {
      setSchoolUsersFetchId(props.id);
    } else if (fetchedSchoolUsers) {
      setUsers(fetchedSchoolUsers);
      dispatch({
        type: ACTION_TYPES.SET_SCHOOL_USERS,
        payload: {
          id: props.id,
          users: fetchedSchoolUsers
        }
      });
    }
  }, [
    props.id,
    cachedSchool,
    fetchedSchoolUsers,
    dispatch,
    schoolUsersFetchId
  ]);

  React.useEffect(() => {
    if (props.id !== state.school.id) {
      getSchool();
    }
  }, [
    props.id,
    state.school.id,
    cachedSchool,
    fetchedSchool,
    dispatch,
    getSchool
  ]);

  React.useEffect(() => {
    if (!school.events) {
      getSchoolEvents();
    }
  }, [
    props.id,
    school,
    cachedSchool,
    fetchedSchoolEvents,
    dispatch,
    getSchoolEvents
  ]);

  React.useEffect(() => {
    if (!school.users) {
      getSchoolUsers();
    }
  }, [
    props.id,
    school,
    cachedSchool,
    fetchedSchoolUsers,
    dispatch,
    getSchoolUsers
  ]);

  if (
    isAuthenticating ||
    isLoadingFetchedSchool ||
    (!!authenticatedUser && isEmpty(school))
  ) {
    return <SchoolSilhouette />;
  }

  if (!school || isEmpty(school)) {
    console.error(`No school found ${props.uri}`);
    return <Redirect to="../../not-found" noThrow />;
  }

  return (
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
      <Stack spacing={10}>
        <Box as="header" display="flex" alignItems="center">
          <SchoolLogo
            schoolId={school.id}
            alt={`${school.name} school logo`}
            h={40}
            w={40}
            bg="white"
            rounded="full"
            border="4px"
            borderColor="gray.300"
            fallback={
              <Flex
                alignItems="center"
                justifyContent="center"
                color="gray.100"
                h={40}
                w={40}
                bg="gray.400"
                rounded="full"
              >
                <FontAwesomeIcon icon={faSchool} size="4x" />
              </Flex>
            }
          />
          <Box pl={12}>
            <Heading
              as="h1"
              fontSize="5xl"
              fontWeight="bold"
              pb={2}
              display="flex"
              alignItems="center"
            >
              {startCase(school.name.toLowerCase())}
            </Heading>
          </Box>
        </Box>
        <Box as="section" pt={4}>
          <VisuallyHidden as="h2">Description</VisuallyHidden>
          <Text>{school.description}</Text>
        </Box>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Information
          </Heading>
          <Flex as="dl" flexWrap="wrap" w="100%">
            <Text as="dt" w="50%" fontWeight="bold">
              Contact Email
            </Text>
            {school.contactEmail ? (
              <Text as="dd" w="50%">
                <OutsideLink href={`mailto:${school.contactEmail}`}>
                  {school.contactEmail}
                </OutsideLink>
              </Text>
            ) : (
              <Text as="dd" w="50%" color="gray.400">
                Nothing set
              </Text>
            )}
            <Text as="dt" w="50%" fontWeight="bold">
              Website
            </Text>
            {school.website &&
            school.website !== constants.EMPTY_SCHOOL_WEBSITE ? (
              <Text as="dd" w="50%">
                {isUrl(school.website) ? (
                  <OutsideLink d="inline-block" href={`//${school.website}`}>
                    {school.website}
                    <Text as="span" ml={2}>
                      <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                    </Text>
                  </OutsideLink>
                ) : (
                  <Text>{school.website}</Text>
                )}
              </Text>
            ) : (
              <Text as="dd" w="50%" color="gray.400">
                Nothing set
              </Text>
            )}
            <Text as="dt" w="50%" fontWeight="bold">
              Address
            </Text>
            {school.address ? (
              <Text as="dd" w="50%">
                <OutsideLink
                  d="inline-block"
                  href={school.googleMapsAddressLink}
                >
                  {startCase(school.address.toLowerCase())}
                  <Text as="span" ml={2}>
                    <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                  </Text>
                </OutsideLink>
              </Text>
            ) : (
              <Text as="dd" w="50%" color="gray.400">
                Nothing set
              </Text>
            )}
          </Flex>
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Upcoming Events
          </Heading>
          {isLoadingFetchedSchoolEvents ? (
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
          ) : events && events.length ? (
            <List>
              {events.map(event => (
                <EventListItem key={event.id} event={event} school={school} />
              ))}
            </List>
          ) : (
            <Text mt={4} color="gray.400">
              {constants.SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT}
            </Text>
          )}
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Members
          </Heading>
          {isLoadingFetchedSchoolUsers ? (
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
                    <Avatar
                      name={user.fullname}
                      src={user.gravatarUrl}
                      h={60}
                      w={60}
                      rounded="full"
                      bg="white"
                    />
                    <Link
                      to={`../../../user/${user.id}`}
                      color="purple.500"
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
              {constants.SCHOOL_EMPTY_USERS_TEXT}
            </Text>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default School;
