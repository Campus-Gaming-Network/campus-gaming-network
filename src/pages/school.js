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
  Spinner,
  Flex
} from "@chakra-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import Gravatar from "react-gravatar";
import * as constants from "../constants";
import OutsideLink from "../components/OutsideLink";
import VisuallyHidden from "../components/VisuallyHidden";
import Link from "../components/Link";
import EventListItem from "../components/EventListItem";
import useFetchSchoolDetails from "../hooks/useFetchSchoolDetails";
import useFetchSchoolEvents from "../hooks/useFetchSchoolEvents";
import useFetchSchoolUsers from "../hooks/useFetchSchoolUsers";
import { firebaseStorage } from "../firebase";

const CACHED_SCHOOLS = {};

const School = props => {
  const [logoUrl, setLogoUrl] = React.useState(null);
  const hasCachedSchool = !!CACHED_SCHOOLS[props.id];
  const shouldFetchSchool =
    !props.appLoading &&
    (!props.school ||
      (props.school && props.id !== props.school.id && !hasCachedSchool));
  const schoolFetchId = shouldFetchSchool ? props.id : null;
  const [fetchedSchool, isLoadingFetchedSchool] = useFetchSchoolDetails(
    schoolFetchId
  );
  const hasCachedSchoolEvents =
    hasCachedSchool && !!CACHED_SCHOOLS[props.id].events;
  const shouldFetchSchoolEvents = shouldFetchSchool || !hasCachedSchoolEvents;
  const eventsSchoolToFetch = shouldFetchSchoolEvents ? props.id : null;
  const [schoolEvents, isLoadingSchoolEvents] = useFetchSchoolEvents(
    eventsSchoolToFetch
  );
  const hasCachedSchoolUsers =
    hasCachedSchool && !!CACHED_SCHOOLS[props.id].users;
  const shouldFetchSchoolUsers = shouldFetchSchool || !hasCachedSchoolUsers;
  const usersSchoolToFetch = shouldFetchSchoolUsers ? props.id : null;
  const [schoolUsers, isLoadingSchoolUsers] = useFetchSchoolUsers(
    usersSchoolToFetch
  );
  const shouldDisplaySilhouette =
    props.appLoading ||
    (shouldFetchSchool && !fetchedSchool) ||
    isLoadingFetchedSchool;

  React.useEffect(() => {
    const fetchSchoolLogo = () => {
      const storageRef = firebaseStorage.ref();
      const pathRef = storageRef.child(
        `schools/${props.school.id}/images/logo.jpg`
      );
      pathRef.getDownloadURL().then(url => {
        setLogoUrl(url);
      });
    };

    if (props.school && props.school.id) {
      fetchSchoolLogo();
    }
  }, [props.school]);

  if (shouldDisplaySilhouette) {
    return (
      <Box as="article" my={16} px={8} mx="auto" maxW="4xl">
        <Box as="header" display="flex" alignItems="center">
          <Box bg="gray.100" w="150px" h="150px" mr="2" borderRadius="full" />
          <Box pl={12}>
            <Box bg="gray.100" w="400px" h="60px" mb="4" borderRadius="md" />
          </Box>
        </Box>
        <Stack spacing={10}>
          <Box as="section" pt={4}>
            <Box bg="gray.100" w="100%" h="60px" borderRadius="md" />
          </Box>
          <Stack as="section" spacing={4}>
            <Box bg="gray.100" w="75px" h="15px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100%" h="100px" borderRadius="md" />
          </Stack>
          <Stack as="section" spacing={4}>
            <Box bg="gray.100" w="75px" h="15px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
          </Stack>
          <Stack as="section" spacing={4}>
            <Box bg="gray.100" w="75px" h="15px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
          </Stack>
        </Stack>
      </Box>
    );
  }

  const school = hasCachedSchool
    ? CACHED_SCHOOLS[props.id]
    : schoolFetchId
    ? fetchedSchool
    : props.school;

  const users = hasCachedSchoolUsers
    ? CACHED_SCHOOLS[props.id].users
    : usersSchoolToFetch
    ? schoolUsers
    : [];

  const events = hasCachedSchoolEvents
    ? CACHED_SCHOOLS[props.id].events
    : eventsSchoolToFetch
    ? schoolEvents
    : [];

  if (!hasCachedSchool) {
    CACHED_SCHOOLS[props.id] = { ...school };
  }

  if (hasCachedSchool && schoolEvents) {
    CACHED_SCHOOLS[props.id] = {
      ...CACHED_SCHOOLS[props.id],
      events: [...schoolEvents]
    };
  }

  if (hasCachedSchool && schoolUsers) {
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
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${school.name} school logo`}
              h={40}
              w={40}
              bg="white"
              rounded="full"
              border="4px"
              borderColor="gray.300"
            />
          ) : (
            <Flex
              alignItems="center"
              justifyContent="center"
              color="gray.100"
              h={40}
              w={40}
              bg="gray.400"
              rounded="full"
              border="4px"
              borderColor="gray.300"
            >
              <FontAwesomeIcon icon={faSchool} size="4x" />
            </Flex>
          )}
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
                <OutsideLink href={school.googleMapsAddressLink}>
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
              test
              {events.map(event => (
                <EventListItem key={event.id} event={event} school={school} />
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
