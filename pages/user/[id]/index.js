// Libraries
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  Stack,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Avatar,
  Flex,
  VisuallyHidden,
  Image,
  Button,
  useClipboard,
  useToast
} from "@chakra-ui/react";
import safeJsonStringify from 'safe-json-stringify';
import { getUserDetails, getUserAttendingEvents } from 'src/api/user'

// Constants
import {
  USER_EMPTY_CURRENTLY_PLAYING_TEXT,
  USER_EMPTY_FAVORITE_GAMES_TEXT,
  USER_EMPTY_ACCOUNTS_TEXT,
  USER_EMPTY_UPCOMING_EVENTS_TEXT
} from "src/constants/user";
import { ACCOUNTS } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import Link from "src/components/Link";
import EventListItem from "src/components/EventListItem";
import GameCover from "src/components/GameCover";
import GameLink from "src/components/GameLink";

// Hooks
import { getSchoolDetails } from "src/api/school";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  const { user } = await getUserDetails(context.params.id);
  const { events } = await getUserAttendingEvents(context.params.id);

  if (!Boolean(user)) {
    return { notFound: true };
  }

  const { school } = await getSchoolDetails(user.school.id);
  const data = {
      user,
      school,
      events,
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
}

////////////////////////////////////////////////////////////////////////////////
// User

const User = (props) => {
  const { authUser } = useAuth();
  const isAuthenticatedUser = React.useMemo(() => authUser && (authUser.uid === props.user.id), [authUser, props.user]);

  return (
    <SiteLayout title={props.user.fullName}>
    <Article>
      {isAuthenticatedUser ? (
        <Box mb={10} textAlign="center" display="flex" justifyContent="center">
          <Link
            href="/edit-user"
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
        </Box>
      ) : null}
      <Box as="header" display="flex" alignItems="center">
        <Avatar name={props.user.fullName} src={props.user.gravatarUrl} mr={2} size="2xl" />
        <Box pl={12}>
          <Heading
            as="h2"
            fontSize="5xl"
            fontWeight="bold"
            pb={2}
            display="flex"
            alignItems="center"
          >
            {props.user.fullName}
          </Heading>
          <Heading
            as="h2"
            fontSize="2xl"
            fontWeight="normal"
            fontStyle="italic"
            display="flex"
            alignItems="center"
          >
            {props.user.displayStatus}
            {Boolean(props.school) ? (
              <Link
                href={`/school/${props.school.id}`}
                color="brand.500"
                fontWeight={600}
                ml={2}
              >
                {props.school.formattedName}
              </Link>
            ) : null}
          </Heading>
        </Box>
      </Box>
      {/* <Image
        src="../profile_illustration_1st_edition_compressed.png"
        alt="Controller leaning on stack of books"
        pos="absolute"
        top="25%"
        left="0"
        right="0"
        bottom="0"
        margin="auto"
        transform="scale(1.25)"
      /> */}
      <Stack spacing={10}>
        <Box as="section" pt={4}>
          <VisuallyHidden as="h2">Biography</VisuallyHidden>
          {Boolean(props.user.bio) ? <Text>{props.user.bio}</Text> : null}
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
            {Boolean(props.user.hometown) ? (
              <Text as="dd" w="50%">
                {props.user.hometown}
              </Text>
            ) : (
              <Text as="dd" w="50%" color="gray.400">
                Nothing set
              </Text>
            )}
            <Text as="dt" w="50%" fontWeight="bold">
              Major
            </Text>
            {Boolean(props.user.major) ? (
              <Text as="dd" w="50%">
                {props.user.major}
              </Text>
            ) : (
              <Text as="dd" w="50%" color="gray.400">
                Nothing set
              </Text>
            )}
            <Text as="dt" w="50%" fontWeight="bold">
              Minor
            </Text>
            {Boolean(props.user.minor) ? (
              <Text as="dd" w="50%">
                {props.user.minor}
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
          <AccountsList user={props.user} />
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
            games={props.user.currentlyPlaying}
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
            games={props.user.favoriteGames}
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
          <EventsList events={props.events} />
        </Stack>
      </Stack>
    </Article>
    </SiteLayout>
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
  const toast = useToast();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const { hasCopied, onCopy } = useClipboard(props.value);

  if (!props.value) {
    return null;
  }

  const handleCopy = (label) => {
    onCopy();
    toast({
      title: "Copied!",
      description: `${label} value copied to clipboard.`,
      status: "info",
      duration: 1500,
    });
  };

  const icon = React.useMemo(() => {
    if (hasCopied) {
      return faCheck;
    } else if (isHovered || isFocused) {
      return faCopy
    } else {
      return props.icon;
    }
  });

  return (
    <ListItem>
      <Box
        as={Button}
        onClick={() => handleCopy(props.label)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        variant="outline"
        bg="white"
        pos="relative"
        alignItems="center"
        display="flex"
        px={4}
        py={6}
        mr={4}
        mb={4}
      >
        <Box borderRight="1px" borderColor="gray.300" pr={4}>
          <FontAwesomeIcon icon={icon} />
        </Box>
        <Box pl={4} textAlign="left">
          <Text fontSize="sm" fontWeight="normal" color="gray.600">{hasCopied ? "Copied!" : props.label}</Text>
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

const EventsList = ({ events }) => {
  // const [events, isLoadingEvents] = useFetchUserEvents(props.id);
  const hasEvents = React.useMemo(
    () => events && events.length && events.length > 0,
    [events]
  );

  // if (isLoadingEvents) {
  //   return (
  //     <List d="flex" flexWrap="wrap" m={-2} p={0}>
  //       {times(DEFAULT_EVENTS_SKELETON_LIST_PAGE_SIZE, index => (
  //         <Box key={index} w={{ base: "50%", md: "33.3333%" }}>
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

  if (hasEvents) {
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
