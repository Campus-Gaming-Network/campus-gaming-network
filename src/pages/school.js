import React from "react";
import startCase from "lodash.startcase";
import {
  Stack,
  Box,
  Heading,
  Text,
  Image,
  List,
  ListItem
} from "@chakra-ui/core";
import * as constants from "../constants";
import { sortedEvents } from "../utilities";
import OutsideLink from "../components/OutsideLink";
import PageWrapper from "../components/PageWrapper";
import VisuallyHidden from "../components/VisuallyHidden";
import Avatar from "../components/Avatar";
import Link from "../components/Link";
import EventListItem from "../components/EventListItem";
import useFetchSchoolProfile from "../hooks/useFetchSchoolProfile";
import useFetchSchoolUsers from "../hooks/useFetchSchoolUsers";

const School = props => {
  const [events, setEvents] = React.useState([]);
  // const [users, setUsers] = React.useState([]);

  let fetchId = null;

  if (props.school && props.school.ref && props.id !== props.school.ref.id) {
    fetchId = props.id;
  }

  const [
    fetchedSchool,
    isLoadingFetchedSchool,
    fetchedSchoolError
  ] = useFetchSchoolProfile(fetchId);

  const school = fetchId ? fetchedSchool : props.school;

  const [users, isLoadingUsers, usersError] = useFetchSchoolUsers(school);

  if (!school) {
    // TODO: Handle gracefully
    console.log("no school");
    return null;
  }

  return (
    <PageWrapper>
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
          {events && events.length ? (
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
          {users && users.length ? (
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
          ) : (
            <Text mt={4} color="gray.500">
              {constants.SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT}
            </Text>
          )}
        </Stack>
      </Stack>
    </PageWrapper>
  );
};

export default School;
