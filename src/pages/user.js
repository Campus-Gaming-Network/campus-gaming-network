import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import startCase from "lodash.startcase";
import isEmpty from "lodash.isempty";
import {
  Stack,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Spinner,
  PseudoBox,
  Avatar,
  Flex
} from "@chakra-ui/core";
import * as constants from "../constants";
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "../firebase";

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
// import useFetchSchools from ".//hooks/useFetchSchools";

////////////////////////////////////////////////////////////////////////////////
// User

const User = props => {
  const dispatch = useAppDispatch();
  const state = useAppState();
  const cachedUser = state.users[props.id];
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = React.useState(false);
  const [userFetchId, setUserFetchId] = React.useState(null);
  const [userEventsFetchId, setUserEventsFetchId] = React.useState(null);
  const [user, setUser] = React.useState(state.user);
  const [events, setEvents] = React.useState(state.user.events);
  const [fetchedUser, isLoadingFetchedUser] = useFetchUserDetails(userFetchId);
  const [fetchedUserEvents, isLoadingFetchedUserEvents] = useFetchUserEvents(
    userEventsFetchId
  );
  const school = user.school ? state.schools[user.school.id] : null;

  const getUser = React.useCallback(() => {
    if (cachedUser) {
      setUser(cachedUser);
    } else if (!userFetchId) {
      setUserFetchId(props.id);
    } else if (fetchedUser) {
      setUser(fetchedUser);
      dispatch({
        type: ACTION_TYPES.SET_USER,
        payload: fetchedUser
      });
    }
  }, [props.id, cachedUser, fetchedUser, dispatch, userFetchId]);

  const getUserEvents = React.useCallback(() => {
    if (cachedUser && cachedUser.events) {
      setEvents(cachedUser.events);
    } else if (!userEventsFetchId) {
      setUserEventsFetchId(props.id);
    } else if (fetchedUserEvents) {
      setEvents(fetchedUserEvents);
      dispatch({
        type: ACTION_TYPES.SET_USER_EVENTS,
        payload: {
          id: props.id,
          events: fetchedUserEvents
        }
      });
    }
  }, [props.id, cachedUser, fetchedUserEvents, dispatch, userEventsFetchId]);

  React.useEffect(() => {
    const _isAuthenticatedUser =
      authenticatedUser && authenticatedUser.uid === props.id;

    if (_isAuthenticatedUser !== isAuthenticatedUser) {
      setIsAuthenticatedUser(_isAuthenticatedUser);
    }
  }, [props.id, cachedUser, authenticatedUser, isAuthenticatedUser]);

  React.useEffect(() => {
    if (props.id !== state.user.id) {
      getUser();
    }
  }, [props.id, state.user.id, cachedUser, fetchedUser, dispatch, getUser]);

  React.useEffect(() => {
    if (!user.events) {
      getUserEvents();
    }
  }, [props.id, user, cachedUser, fetchedUserEvents, dispatch, getUserEvents]);

  if (
    isAuthenticating ||
    isLoadingFetchedUser ||
    (!!authenticatedUser && isEmpty(user))
  ) {
    return <UserSilhouette />;
  }

  if (!user || isEmpty(user)) {
    console.error(`No user found ${props.uri}`);
    return <Redirect to="../../not-found" noThrow />;
  }

  return (
    <Box as="article" mt={10} mb={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
      {isAuthenticatedUser ? (
        <PseudoBox
          mb={10}
          textAlign="center"
          display="flex"
          justifyContent="center"
        >
          <Link
            to="/user/edit"
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
          name={user.fullname}
          src={user.gravatarUrl}
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
          {user.hasAccounts ? (
            <List display="flex" flexWrap="wrap" width="100%" styleType="none">
              {Object.keys(constants.ACCOUNTS).map(key => {
                const account = constants.ACCOUNTS[key];
                const value = user[key];

                if (!value) {
                  return null;
                }

                return (
                  <ListItem key={key}>
                    <Box
                      borderWidth="1px"
                      boxShadow="lg"
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
                        <FontAwesomeIcon icon={account.icon} />
                      </Box>
                      <Box pl={4}>
                        <Text fontSize="sm">{account.label}</Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {value}
                        </Text>
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Text color="gray.400">{constants.USER_EMPTY_ACCOUNTS_TEXT}</Text>
          )}
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
            emptyText={constants.USER_EMPTY_CURRENTLY_PLAYING_TEXT}
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
            emptyText={constants.USER_EMPTY_FAVORITE_GAMES_TEXT}
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
          {isLoadingFetchedUserEvents ? (
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
                <EventListItem key={event.id} {...event} />
              ))}
            </List>
          ) : (
            <Text color="gray.400">
              {constants.USER_EMPTY_UPCOMING_EVENTS_TEXT}
            </Text>
          )}
        </Stack>
      </Stack>
    </Box>
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

export default User;
