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
  Flex,
  Avatar,
  Button,
  Skeleton
} from "@chakra-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import isEmpty from "lodash.isempty";
import times from "lodash.times";
import {
  EMPTY_SCHOOL_WEBSITE,
  SCHOOL_EMPTY_USERS_TEXT,
  DEFAULT_EVENTS_SKELETON_LIST_PAGE_SIZE,
  SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT,
  DEFAULT_USERS_LIST_PAGE_SIZE,
  DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE,
  COLLECTIONS
} from "../constants";

import OutsideLink from "../components/OutsideLink";
import VisuallyHidden from "../components/VisuallyHidden";
import Link from "../components/Link";
import EventListItem from "../components/EventListItem";
/* eslint-disable no-unused-vars */
import SchoolLogo from "../components/SchoolLogo";
import SchoolSilhouette from "../components/SchoolSilhouette";

import useFetchSchoolDetails from "../hooks/useFetchSchoolDetails";
import useFetchSchoolEvents from "../hooks/useFetchSchoolEvents";
import useFetchSchoolUsers from "../hooks/useFetchSchoolUsers";
import { useAppDispatch, useAppState, ACTION_TYPES } from "../store";
import { isUrl } from "../utilities";

////////////////////////////////////////////////////////////////////////////////
// School

const School = props => {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const [school, isLoadingSchool] = useFetchSchoolDetails(props.id);

  React.useEffect(() => {
    if (props.id !== state.school.id && !isLoadingSchool) {
      dispatch({
        type: ACTION_TYPES.SET_SCHOOL,
        payload: school
      });
    }
  }, [props.id, state.school.id, dispatch, school, isLoadingSchool]);

  if (isLoadingSchool) {
    return <SchoolSilhouette />;
  }

  if (!school || isEmpty(school)) {
    console.error(`No school found ${props.uri}`);
    return <Redirect to="/not-found" noThrow />;
  }

  return (
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
      <Stack spacing={10}>
        <Box as="header" display="flex" alignItems="center">
          <SchoolLogo
            schoolId={school.id}
            schoolName={school.name}
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
            {school.website && school.website !== EMPTY_SCHOOL_WEBSITE ? (
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
          <EventsList id={props.id} />
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
          <UsersList id={props.id} />
        </Stack>
      </Stack>
    </Box>
  );
};

////////////////////////////////////////////////////////////////////////////////
// EventsList

const EventsList = props => {
  const dispatch = useAppDispatch();
  const [page] = React.useState(0);
  const [events, isLoadingEvents] = useFetchSchoolEvents(
    props.id,
    undefined,
    page
  );

  React.useEffect(() => {
    if (isLoadingEvents && events && page >= 0) {
      dispatch({
        type: ACTION_TYPES.SET_SCHOOL_EVENTS,
        payload: {
          id: props.id,
          events,
          page
        }
      });
    }
  }, [isLoadingEvents, events, dispatch, props.id, page]);

  if (isLoadingEvents) {
    return (
      <List d="flex" flexWrap="wrap" m={-2} p={0}>
        {times(DEFAULT_EVENTS_SKELETON_LIST_PAGE_SIZE, index => (
          <Box key={index} w={{ md: "33%", sm: "50%", xs: "100%" }}>
            <Skeleton
              pos="relative"
              d="flex"
              m={2}
              p={4}
              h={151}
              rounded="lg"
            />
          </Box>
        ))}
      </List>
    );
  }

  if (events && events.length && events.length > 0) {
    return (
      <List d="flex" flexWrap="wrap" m={-2} p={0}>
        {events.map(event => (
          <EventListItem
            key={event.id}
            event={event}
            school={event.schoolDetails}
          />
        ))}
      </List>
    );
  }

  return (
    <Text mt={4} color="gray.400">
      {SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT}
    </Text>
  );
};

////////////////////////////////////////////////////////////////////////////////
// UsersList

const UsersList = props => {
  const dispatch = useAppDispatch();
  const [page, setPage] = React.useState(0);
  const [users, isLoadingUsers] = useFetchSchoolUsers(
    props.id,
    undefined,
    page
  );

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
        type: ACTION_TYPES.SET_SCHOOL_USERS,
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
              variantColor="purple"
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
              variantColor="purple"
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
      {SCHOOL_EMPTY_USERS_TEXT}
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

export default School;
