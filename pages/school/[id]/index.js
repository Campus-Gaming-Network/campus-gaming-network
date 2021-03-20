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
  VisuallyHidden
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import safeJsonStringify from "safe-json-stringify";
import {
  getSchoolDetails,
  getSchoolEvents,
  getSchoolUsers
} from "src/api/school";

// Constants
import {
  EMPTY_SCHOOL_WEBSITE,
  SCHOOL_EMPTY_USERS_TEXT,
  SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT
} from "src/constants/school";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import OutsideLink from "src/components/OutsideLink";
import Link from "src/components/Link";
import EventListItem from "src/components/EventListItem";
import SchoolLogo from "src/components/SchoolLogo";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  const [schoolResponse, usersResponse, eventsResponse] = await Promise.all([
    getSchoolDetails(context.params.id),
    getSchoolUsers(context.params.id),
    getSchoolEvents(context.params.id)
  ]);
  const { school } = schoolResponse;
  const { users } = usersResponse;
  const { events } = eventsResponse;

  if (!Boolean(school)) {
    return { notFound: true };
  }

  const data = { school, users, events };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// School

const School = props => {
  return (
    <SiteLayout meta={props.school.meta}>
      <Box bg="gray.100" h="150px" />
      <Article>
        <Flex align="center" justify="center">
          <Box mt={{ base: -50, sm: -100, md: -150 }}>
            <SchoolLogo
              rounded="full"
              bg="white"
              shadow="sm"
              borderWidth={2}
              borderStyle="solid"
              schoolId={props.school.id}
              schoolName={props.school.formattedName}
              h={40}
              w={40}
              htmlHeight={40}
              htmlWidth={40}
              fallback={
                <Flex
                  rounded="full"
                  bg="white"
                  shadow="sm"
                  borderWidth={2}
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
          </Box>
        </Flex>
        <Stack spacing={10}>
          <Box
            as="header"
            display="flex"
            alignItems="center"
            px={{ base: 4, md: 0 }}
            pt={8}
            textAlign="center"
          >
            <Box>
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
              px={{ base: 4, md: 0 }}
            >
              Information
            </Heading>
            <Flex as="dl" flexWrap="wrap" w="100%" px={{ base: 4, md: 0 }}>
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
              {props.school.website &&
              props.school.website !== EMPTY_SCHOOL_WEBSITE ? (
                <Text as="dd" w="50%">
                  {props.school.isValidWebsiteUrl ? (
                    <OutsideLink
                      d="inline-block"
                      href={`//${props.school.website}`}
                    >
                      {props.school.website}
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
              px={{ base: 4, md: 0 }}
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
              px={{ base: 4, md: 0 }}
            >
              Members
            </Heading>
            <UsersList users={props.users} />
          </Stack>
        </Stack>
      </Article>
    </SiteLayout>
  );
};

////////////////////////////////////////////////////////////////////////////////
// EventsList

const EventsList = props => {
  // const dispatch = useAppDispatch();
  // const [page] = React.useState(0);
  // const [events, isLoadingEvents] = useFetchSchoolEvents(
  //   props.id,
  //   undefined,
  //   page
  // );

  if (Boolean(props.events) && props.events.length && props.events.length > 0) {
    return (
      <List d="flex" flexWrap="wrap" m={-2} p={0}>
        {props.events.map(event => (
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

const UsersList = props => {
  // const dispatch = useAppDispatch();
  // const [page, setPage] = React.useState(0);
  // const [users, isLoadingUsers] = useFetchSchoolUsers(
  //   props.id,
  //   undefined,
  //   page
  // );
  const hasUsers = React.useMemo(
    () => Boolean(props.users) && props.users.length && props.users.length > 0,
    [props.users]
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
    <ListItem w={{ base: "33.3333%", md: "20%" }}>
      <Box
        shadow="sm"
        borderWidth={1}
        borderStyle="solid"
        rounded="lg"
        bg="white"
        pos="relative"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mr={5}
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

export default School;
