import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import capitalize from "lodash.capitalize";
import startCase from "lodash.startcase";
import Gravatar from "react-gravatar";
import {
  Stack,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Spinner
} from "@chakra-ui/core";
import * as constants from "../constants";
import { sortedEvents } from "../utilities";
import VisuallyHidden from "../components/VisuallyHidden";
import Link from "../components/Link";
import EventListItem from "../components/EventListItem";
import Flex from "../components/Flex";
import useFetchUserProfile from "../hooks/useFetchUserProfile";
import useFetchUserEvents from "../hooks/useFetchUserEvents";

const CACHED_USERS = {};

const User = props => {
  const hasCachedUser = !!CACHED_USERS[props.id];
  const shouldFetchUser = !hasCachedUser && props.id !== props.user.ref.id;
  const userFetchId = shouldFetchUser ? props.id : null;
  const [fetchedUser, isLoadingFetchedUser] = useFetchUserProfile(userFetchId);
  const [events, isLoadingFetchedEvents] = useFetchUserEvents(props.id);

  const user = hasCachedUser
    ? CACHED_USERS[props.id]
    : userFetchId
    ? fetchedUser
    : props.user;

  if (!hasCachedUser) {
    CACHED_USERS[props.id] = { ...user };
  }

  if (isLoadingFetchedUser) {
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

  if (!user) {
    console.error(`No user found ${props.uri}`);
    return <Redirect to="not-found" noThrow />;
  }

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
      <Box as="header" display="flex" alignItems="center">
        <Gravatar
          default={constants.GRAVATAR.DEFAULT}
          rating={constants.GRAVATAR.RA}
          md5={user ? user.gravatar : null}
          className="rounded-full border-4 bg-white border-gray-300 mr-2"
          size={150}
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
            {user.firstName}
            {user.lastName ? ` ${user.lastName}` : ""}
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
              <Text className="text-base">
                <VisuallyHidden>User is a verified student</VisuallyHidden>
                <FontAwesomeIcon className="mr-1 text-blue-600" icon={faStar} />
              </Text>
            )}
            {`${
              user.status === "ALUMNI"
                ? "Alumni of "
                : user.status === "GRAD"
                ? "Graduate Student at "
                : `${capitalize(user.status)} at `
            }`}
            {props.school ? (
              <Link
                to={`/school/${props.school.ref.id}`}
                className={`${constants.STYLES.LINK.DEFAULT} ml-2`}
              >
                {startCase(props.school.name.toLowerCase())}
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
          <Flex tag="dl" wrap className="w-full">
            <dt className="w-1/2 font-bold">Hometown</dt>
            {user.hometown ? (
              <dd className="w-1/2">{user.hometown}</dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
            <dt className="w-1/2 font-bold">Major</dt>
            {user.major ? (
              <dd className="w-1/2">{user.major}</dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
            <dt className="w-1/2 font-bold">Minor</dt>
            {user.minor ? (
              <dd className="w-1/2">{user.minor}</dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
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
          {Object.keys(constants.ACCOUNTS).length ? (
            <Box display="flex" as="ul" flexWrap="wrap" width="100%">
              {Object.keys(constants.ACCOUNTS).map(key => {
                const account = constants.ACCOUNTS[key];
                const value = user[key];

                if (!value) {
                  return null;
                }

                return (
                  <Box as="li" key={key}>
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
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Text className="text-gray-500">
              {constants.USER_EMPTY_ACCOUNTS_TEXT}
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
            Currently Playing
          </Heading>
          {user.hasCurrentlyPlaying ? (
            <List display="flex" flexWrap="wrap">
              {user.currentlyPlaying.map(game => (
                <ListItem key={game.name} className="w-1/5">
                  <img
                    className="rounded h-40 shadow-lg"
                    src={constants.TEST_VIDEO_GAME_COVER}
                    alt={`The cover art for ${game.name}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <p className="text-gray-500">
              {constants.USER_EMPTY_CURRENTLY_PLAYING_TEXT}
            </p>
          )}
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
          {user.hasCurrentlyPlaying ? (
            <List display="flex" flexWrap="wrap">
              {user.favoriteGames.map(game => (
                <ListItem key={game.name} className="w-1/5">
                  <img
                    className="rounded h-40 shadow-lg"
                    src={constants.TEST_VIDEO_GAME_COVER}
                    alt={`The cover art for ${game.name}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <p className="text-gray-500">
              {constants.USER_EMPTY_FAVORITE_GAMES_TEXT}
            </p>
          )}
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
          {isLoadingFetchedEvents ? (
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
            <Text mt={4} color="gray.500">
              {constants.USER_EMPTY_UPCOMING_EVENTS_TEXT}
            </Text>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default User;
