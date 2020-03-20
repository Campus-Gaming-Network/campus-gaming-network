import React from "react";
import { Redirect } from "@reach/router";
import startCase from "lodash.startcase";
import {
  Stack,
  Box,
  Heading,
  Text,
  Image,
  List,
  ListItem,
  Spinner
} from "@chakra-ui/core";
import Gravatar from "react-gravatar";
import * as constants from "../constants";
import { sortedEvents } from "../utilities";
import OutsideLink from "../components/OutsideLink";
import VisuallyHidden from "../components/VisuallyHidden";
import Link from "../components/Link";
import EventListItem from "../components/EventListItem";
import useFetchSchoolProfile from "../hooks/useFetchSchoolProfile";
import useFetchSchoolEvents from "../hooks/useFetchSchoolEvents";
import useFetchSchoolUsers from "../hooks/useFetchSchoolUsers";

const CACHED_SCHOOLS = {};

const School = props => {
  const hasCachedSchool = !!CACHED_SCHOOLS[props.id];
  const shouldFetchSchool =
    !hasCachedSchool && props.id !== props.school.ref.id;
  const schoolFetchId = shouldFetchSchool ? props.id : null;
  const [fetchedSchool, isLoadingFetchedSchool] = useFetchSchoolProfile(
    schoolFetchId
  );
  const school = hasCachedSchool
    ? CACHED_SCHOOLS[props.id]
    : schoolFetchId
    ? fetchedSchool
    : props.school;

  if (!hasCachedSchool) {
    CACHED_SCHOOLS[props.id] = { ...school };
  }

  const hasCachedSchoolEvents = !!CACHED_SCHOOLS[props.id].events;
  const shouldFetchSchoolEvents = !(
    hasCachedSchoolEvents && hasCachedSchoolEvents
  );
  const eventsSchoolToFetch = shouldFetchSchoolEvents ? props.id : null;
  const [schoolEvents, isLoadingSchoolEvents] = useFetchSchoolEvents(
    eventsSchoolToFetch
  );

  const events = hasCachedSchoolEvents
    ? CACHED_SCHOOLS[props.id].events
    : schoolEvents;

  const hasCachedSchoolUsers = !!CACHED_SCHOOLS[props.id].users;
  const shouldFetchSchoolUsers = !(hasCachedSchool && hasCachedSchoolUsers);
  const usersSchoolToFetch = shouldFetchSchoolUsers ? props.id : null;
  const [schoolUsers, isLoadingSchoolUsers] = useFetchSchoolUsers(
    usersSchoolToFetch
  );

  if (isLoadingFetchedSchool) {
    return (
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
    );
  }

  const users = hasCachedSchoolUsers
    ? CACHED_SCHOOLS[props.id].users
    : schoolUsers;

  if (schoolUsers) {
    CACHED_SCHOOLS[props.id] = {
      ...CACHED_SCHOOLS[props.id],
      users: [...schoolUsers]
    };
  }

  if (!school) {
    console.error(`No school found ${props.uri}`);
    return <Redirect to="not-found" noThrow />;
  }

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
      <Stack spacing={10}>
        <Box as="header" display="flex" alignItems="center">
          <Image
            src={school.logo}
            alt={`${school.name} school logo`}
            className="h-40 w-40 bg-gray-400 rounded-full border-4 border-gray-300"
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
          <dl className="flex flex-wrap w-full">
            <dt className="w-1/2 font-bold">Contact Email</dt>
            {school.contactEmail ? (
              <dd className="w-1/2">
                <a
                  className={constants.STYLES.LINK.DEFAULT}
                  href={`mailto:${school.contactEmail}`}
                >
                  {school.contactEmail}
                </a>
              </dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
            <dt className="w-1/2 font-bold">Website</dt>
            {school.website ? (
              <dd className="w-1/2">
                <OutsideLink href={`//${school.website}`}>
                  {school.website}
                </OutsideLink>
              </dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
            <dt className="w-1/2 font-bold">Address</dt>
            {school.address ? (
              <dd className="w-1/2">
                <OutsideLink
                  href={`${constants.GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(
                    school.address
                  )}`}
                >
                  {startCase(school.address.toLowerCase())}
                </OutsideLink>
              </dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
          </dl>
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
          {isLoadingSchoolEvents ? (
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
              {sortedEvents(events).map(event => (
                <EventListItem key={event.id} event={event} />
              ))}
            </List>
          ) : (
            <Text mt={4} className="text-gray-500">
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
          {isLoadingSchoolUsers ? (
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
                      {user.firstName}
                      {user.lastName ? ` ${user.lastName}` : ""}
                    </Link>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Text mt={4} color="gray.500">
              {constants.SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT}
            </Text>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default School;
