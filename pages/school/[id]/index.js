// Libraries
import React from "react";
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
  Skeleton,
  VisuallyHidden
} from "@chakra-ui/react";
import { ArrowBack, ArrowForward } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faSchool } from "@fortawesome/free-solid-svg-icons";
import isEmpty from "lodash.isempty";
import times from "lodash.times";
import safeJsonStringify from 'safe-json-stringify';
import { getSchoolDetails, getSchoolEvents, getSchoolUsers } from 'src/api/school';
import Head from 'next/head'

// Constants
import {
  EMPTY_SCHOOL_WEBSITE,
  SCHOOL_EMPTY_USERS_TEXT,
  SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT
} from "src/constants/school";
import {
  DEFAULT_EVENTS_SKELETON_LIST_PAGE_SIZE,
  DEFAULT_USERS_LIST_PAGE_SIZE,
  DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE
} from "src/constants/other";

// Components
import OutsideLink from "src/components/OutsideLink";
import Link from "src/components/Link";
import EventListItem from "src/components/EventListItem";
import SchoolLogo from "src/components/SchoolLogo";
import SchoolSilhouette from "src/components/silhouettes/SchoolSilhouette";

// Hooks
import useFetchSchoolDetails from "src/hooks/useFetchSchoolDetails";
import useFetchSchoolEvents from "src/hooks/useFetchSchoolEvents";
import useFetchSchoolUsers from "src/hooks/useFetchSchoolUsers";

// Utilities
import { isValidUrl } from "src/utilities/other";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async ({ params }) => {
  const { school } = await getSchoolDetails(params.id);
  const { users } = await getSchoolUsers(params.id);
  const { events } = await getSchoolEvents(params.id);

  if (!school) {
    return { notFound: true };
  }

  const data = { school, users, events };

  return { props: JSON.parse(safeJsonStringify(data)) };
}

////////////////////////////////////////////////////////////////////////////////
// School

const School = (props) => {
  return (
    <React.Fragment>
          <Head>
        <title>{props.school.formattedName} | CGN</title>
      </Head>
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
      <Stack spacing={10}>
        <Box as="header" display="flex" alignItems="center">
          <SchoolLogo
            schoolId={props.school.id}
            schoolName={props.school.name}
            h={40}
            w={40}
            fallback={
              <Flex
                alignItems="center"
                justifyContent="center"
                color="gray.600"
                h={40}
                w={40}
              >
                <FontAwesomeIcon icon={faSchool} size="4x" />
              </Flex>
            }
          />
          <Box pl={12}>
            <Heading
              as="h2"
              fontSize="5xl"
              fontWeight="bold"
              pb={2}
              display="flex"
              alignItems="center"
            >
              {props.school.formattedName}
            </Heading>
          </Box>
        </Box>
        <Box as="section" pt={4}>
          <VisuallyHidden as="h2">Description</VisuallyHidden>
          <Text>{props.school.description}</Text>
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
            {Boolean(props.school.contactEmail) ? (
              <Text as="dd" w="50%">
                <OutsideLink href={`mailto:${props.school.contactEmail}`}>
                  {props.school.contactEmail}
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
            {props.school.website && props.school.website !== EMPTY_SCHOOL_WEBSITE ? (
              <Text as="dd" w="50%">
                {props.school.isValidWebsiteUrl ? (
                  <OutsideLink d="inline-block" href={`//${props.school.website}`}>
                    {props.school.website}
                    <Text as="span" ml={2}>
                      <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                    </Text>
                  </OutsideLink>
                ) : (
                  <Text>{props.school.website}</Text>
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
            {Boolean(props.school.address) ? (
              <Text as="dd" w="50%">
                <OutsideLink
                  d="inline-block"
                  href={props.school.googleMapsAddressLink}
                >
                  {props.school.formattedAddress}
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
          <EventsList events={props.events} />
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
          <UsersList users={props.users} />
        </Stack>
      </Stack>
    </Box>
    </React.Fragment>
  );
};

////////////////////////////////////////////////////////////////////////////////
// EventsList

const EventsList = ({ events }) => {
  // const dispatch = useAppDispatch();
  // const [page] = React.useState(0);
  // const [events, isLoadingEvents] = useFetchSchoolEvents(
  //   props.id,
  //   undefined,
  //   page
  // );

  // React.useEffect(() => {
  //   if (isLoadingEvents && events && page >= 0) {
  //     dispatch({
  //       type: ACTION_TYPES.SET_SCHOOL_EVENTS,
  //       payload: {
  //         id: props.id,
  //         events,
  //         page
  //       }
  //     });
  //   }
  // }, [isLoadingEvents, events, dispatch, props.id, page]);

  // if (isLoadingEvents) {
  //   return (
  //     <List d="flex" flexWrap="wrap" m={-2} p={0}>
  //       {times(DEFAULT_EVENTS_SKELETON_LIST_PAGE_SIZE, index => (
  //         <Box key={index} w={{ md: "33%", sm: "50%" }}>
  //           <Skeleton
  //             pos="relative"
  //             d="flex"
  //             m={2}
  //             p={4}
  //             h={151}
  //             rounded="lg"
  //           />
  //         </Box>
  //       ))}
  //     </List>
  //   );
  // }

  if (events && events.length && events.length > 0) {
    return (
      <List d="flex" flexWrap="wrap" m={-2} p={0}>
        {events.map(event => (
          <EventListItem key={event.id} event={event} school={event.school} />
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

const UsersList = ({ users }) => {
  // const dispatch = useAppDispatch();
  // const [page, setPage] = React.useState(0);
  // const [users, isLoadingUsers] = useFetchSchoolUsers(
  //   props.id,
  //   undefined,
  //   page
  // );
  const hasUsers = React.useMemo(
    () => users && users.length && users.length > 0,
    [users]
  );
  // const isFirstPage = React.useMemo(() => page === 0, [page]);
  // const isLastPage = React.useMemo(
  //   () => hasUsers && users.length === DEFAULT_USERS_LIST_PAGE_SIZE,
  //   [hasUsers, users]
  // );
  // const isValidPage = React.useMemo(() => page >= 0, [page]);

  // const nextPage = () => {
  //   if (!isLastPage) {
  //     setPage(page + 1);
  //   }
  // };

  // const prevPage = () => {
  //   if (!isFirstPage) {
  //     setPage(page - 1);
  //   }
  // };

  // React.useEffect(() => {
  //   if (isLoadingUsers && hasUsers && isValidPage) {
  //     dispatch({
  //       type: ACTION_TYPES.SET_SCHOOL_USERS,
  //       payload: {
  //         id: props.id,
  //         users,
  //         page
  //       }
  //     });
  //   }
  // }, [isLoadingUsers, users, hasUsers, dispatch, props.id, page, isValidPage]);

  // if (isLoadingUsers) {
  //   return (
  //     <Flex flexWrap="wrap" mx={-2}>
  //       {times(DEFAULT_USERS_SKELETON_LIST_PAGE_SIZE, index => (
  //         <Box key={index} w={{ md: "20%", sm: "33%" }}>
  //           <Skeleton
  //             pos="relative"
  //             d="flex"
  //             m={2}
  //             p={4}
  //             h={130}
  //             rounded="lg"
  //           />
  //         </Box>
  //       ))}
  //     </Flex>
  //   );
  // }

  // console.log({
  //   users,
  //   isFirstPage,
  //   isLastPage
  // });

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
        {/* <Flex justifyContent="space-between" m={2}>
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
        </Flex> */}
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

export default School;
