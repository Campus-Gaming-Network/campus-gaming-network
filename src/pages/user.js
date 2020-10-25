import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import startCase from "lodash.startcase";
import isEmpty from "lodash.isempty";
import times from "lodash.times";
import {
  Stack,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Skeleton,
  PseudoBox,
  Avatar,
  Flex
} from "@chakra-ui/core";
import {
  USER_EMPTY_CURRENTLY_PLAYING_TEXT,
  USER_EMPTY_FAVORITE_GAMES_TEXT,
  ACCOUNTS,
  DEFAULT_EVENTS_SKELETON_LIST_PAGE_SIZE,
  USER_EMPTY_UPCOMING_EVENTS_TEXT,
  USER_EMPTY_ACCOUNTS_TEXT,
  COLLECTIONS
} from "../constants";
import { useAuthState } from "react-firebase-hooks/auth";

// Utilities
import { firebaseAuth } from "../firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";

// Components
import VisuallyHidden from "../components/VisuallyHidden";
import Link from "../components/Link";
import EventListItem from "../components/EventListItem";
import UserSilhouette from "../components/UserSilhouette";
import GameCover from "../components/GameCover";
import GameLink from "../components/GameLink";

// Hooks
import useFetchUserDetails from "../hooks/useFetchUserDetails";
import useFetchUserEvents from "../hooks/useFetchUserEvents";
import useFetchSchoolDetails from "../hooks/useFetchSchoolDetails";

////////////////////////////////////////////////////////////////////////////////
// User

const User = props => {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const [authenticatedUser] = useAuthState(firebaseAuth);
  const [user, isLoadingUser] = useFetchUserDetails(props.id);
  const [school, isLoadingSchool] = useFetchSchoolDetails(
    user ? user.school.id : null
  );
  const isAuthenticatedUser = React.useMemo(
    () => !!authenticatedUser && authenticatedUser.uid === props.id,
    [authenticatedUser, props.id]
  );

  React.useEffect(() => {
    if (props.id !== state.user.id && !isLoadingUser) {
      dispatch({
        type: ACTION_TYPES.SET_USER,
        payload: user
      });
    }
  }, [props.id, state.user.id, dispatch, user, isLoadingUser]);

  React.useEffect(() => {
    if (!!school && school.id !== state.school.id && !isLoadingSchool) {
      dispatch({
        type: ACTION_TYPES.SET_SCHOOL,
        payload: school
      });
    }
  }, [state.school.id, dispatch, school, isLoadingSchool]);

  if (isLoadingUser || isLoadingSchool) {
    return <UserSilhouette />;
  }

  if (!user || isEmpty(user)) {
    console.error(`No user found ${props.uri}`);
    return <Redirect to="/not-found" noThrow />;
  }

  return (
    <Box as="article" pt={10} pb={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
      {isAuthenticatedUser ? (
        <PseudoBox
          mb={10}
          textAlign="center"
          display="flex"
          justifyContent="center"
        >
          <Link
            to="/edit-user"
            fontWeight="bold"
            width="100%"
            borderRadius="md"
            bg="gray.100"
            _focus={{ bg: "gray.200", boxShadow: "outline" }}
            _hover={{ bg: "gray.200" }}
            p={8}
          >
            Edit Your Profile
          </Link>
        </PseudoBox>
      ) : null}
      <Box as="header" display="flex" alignItems="center">
        <Avatar
          name={user.fullName}
          src={user.gravatarUrl}
          alt={`The profile picture for ${user.fullName}`}
          title={`The profile picture for ${user.fullName}`}
          h={150}
          w={150}
          rounded="full"
          mr={2}
          bg="white"
          borderWidth={4}
          borderColor="gray.300"
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
            {user.fullName}
          </Heading>
          <Heading
            as="h2"
            fontSize="2xl"
            fontWeight="normal"
            fontStyle="italic"
            display="flex"
            alignItems="center"
          >
            {user.isVerifiedStudent && (
              <Text>
                <VisuallyHidden>User is a verified student</VisuallyHidden>
                <Text mr={1} color="blue.500">
                  <FontAwesomeIcon icon={faStar} />
                </Text>
              </Text>
            )}
            {user.displayStatus}
            {school ? (
              <Link
                to={`/school/${school.id}`}
                color="purple.500"
                fontWeight={600}
                ml={2}
              >
                {startCase(school.name.toLowerCase())}
              </Link>
            ) : null}
          </Heading>
        </Box>
      </Box>
      <Stack spacing={10}>
        <Box as="section" pt={4}>
          <VisuallyHidden as="h2">Biography</VisuallyHidden>
          {user.bio ? <Text>{user.bio}</Text> : null}
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
              Hometown
            </Text>
            {user.hometown ? (
              <Text as="dd" w="50%">
                {user.hometown}
              </Text>
            ) : (
              <Text as="dd" w="50%" color="gray.400">
                Nothing set
              </Text>
            )}
            <Text as="dt" w="50%" fontWeight="bold">
              Major
            </Text>
            {user.major ? (
              <Text as="dd" w="50%">
                {user.major}
              </Text>
            ) : (
              <Text as="dd" w="50%" color="gray.400">
                Nothing set
              </Text>
            )}
            <Text as="dt" w="50%" fontWeight="bold">
              Minor
            </Text>
            {user.minor ? (
              <Text as="dd" w="50%">
                {user.minor}
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
            Accounts
          </Heading>
          <AccountsList user={user} />
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Currently Playing
          </Heading>
          <GameList
            games={user.currentlyPlaying}
            emptyText={USER_EMPTY_CURRENTLY_PLAYING_TEXT}
          />
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Favorite Games
          </Heading>
          <GameList
            games={user.favoriteGames}
            emptyText={USER_EMPTY_FAVORITE_GAMES_TEXT}
          />
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Events Attending
          </Heading>
          <EventsList user={user} id={props.id} />
        </Stack>
      </Stack>
    </Box>
  );
};

////////////////////////////////////////////////////////////////////////////////
// AccountsList

const AccountsList = props => {
  if (props.user && props.user.hasAccounts) {
    return (
      <List display="flex" flexWrap="wrap" width="100%" styleType="none">
        {Object.keys(ACCOUNTS).map(key => {
          const account = ACCOUNTS[key];
          const value = props.user[key];

          return (
            <AccountsListItem
              key={key}
              icon={account.icon}
              label={account.label}
              value={value}
            />
          );
        })}
      </List>
    );
  }

  return <Text color="gray.400">{USER_EMPTY_ACCOUNTS_TEXT}</Text>;
};

////////////////////////////////////////////////////////////////////////////////
// AccountsListItem

const AccountsListItem = props => {
  if (!props.value) {
    return null;
  }

  return (
    <ListItem>
      <Box
        shadow="sm"
        borderWidth={1}
        rounded="lg"
        bg="white"
        pos="relative"
        alignItems="center"
        display="flex"
        px={4}
        py={2}
        mr={4}
        mb={4}
      >
        <Box borderRight="1px" borderColor="gray.300" pr={4}>
          <FontAwesomeIcon icon={props.icon} />
        </Box>
        <Box pl={4}>
          <Text fontSize="sm">{props.label}</Text>
          <Text fontSize="sm" fontWeight="bold">
            {props.value}
          </Text>
        </Box>
      </Box>
    </ListItem>
  );
};

////////////////////////////////////////////////////////////////////////////////
// GameList

const GameList = props => {
  if (!props.games || props.games.length === 0) {
    return <Text color="gray.400">{props.emptyText || "No games"}</Text>;
  }

  return (
    <List display="flex" flexWrap="wrap">
      {props.games.map(game => (
        <GameListItem
          key={game.slug}
          name={game.name}
          slug={game.slug}
          url={game.cover ? game.cover.url : null}
        />
      ))}
    </List>
  );
};

////////////////////////////////////////////////////////////////////////////////
// GameListItem

const GameListItem = React.memo(props => {
  return (
    <ListItem w="100px" mt={4} mr={4}>
      <GameCover name={props.name} url={props.url} />
      <GameLink name={props.name} slug={props.slug} />
    </ListItem>
  );
});

////////////////////////////////////////////////////////////////////////////////
// EventsList

const EventsList = props => {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const [events, isLoadingEvents] = useFetchUserEvents(props.id);

  React.useEffect(() => {
    if (isLoadingEvents && !!events) {
      dispatch({
        type: ACTION_TYPES.SET_USER_EVENTS,
        payload: {
          id: props.id,
          events: events
        }
      });
    }
  }, [props.id, state.user.id, events, dispatch, isLoadingEvents]);

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
          <EventListItem key={event.id} {...event} />
        ))}
      </List>
    );
  }

  return <Text color="gray.400">{USER_EMPTY_UPCOMING_EVENTS_TEXT}</Text>;
};

export default User;
