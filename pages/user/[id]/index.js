// Libraries
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faFlag,
  faEllipsisV,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
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
  Button,
  useClipboard,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useBoolean,
} from "@chakra-ui/react";
import safeJsonStringify from "safe-json-stringify";
import dynamic from "next/dynamic";

// Constants
import {
  USER_EMPTY_CURRENTLY_PLAYING_TEXT,
  USER_EMPTY_FAVORITE_GAMES_TEXT,
  USER_EMPTY_ACCOUNTS_TEXT,
  USER_EMPTY_UPCOMING_EVENTS_TEXT,
  USER_EMPTY_TEAMS_TEXT,
} from "src/constants/user";
import { ACCOUNTS, NOT_FOUND } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import Link from "src/components/Link";
import GameCover from "src/components/GameCover";
import GameLink from "src/components/GameLink";
import SliderLazyLoad from "src/components/SliderLazyLoad";
import ButtonLink from "src/components/ButtonLink";
import EmptyText from "src/components/EmptyText";

// API
import { getSchoolDetails } from "src/api/school";
import { getUserDetails, getUserTeams } from "src/api/user";

// Providers
import { useAuth } from "src/providers/auth";

// Dynamic Components
const TwitchEmbed = dynamic(() => import("src/components/TwitchEmbed"), {
  ssr: false,
});
const ReportEntityDialog = dynamic(
  () => import("src/components/dialogs/ReportEntityDialog"),
  {
    ssr: false,
  }
);
const AttendingEvents = dynamic(
  () => import("src/components/AttendingEvents"),
  { ssr: false }
);

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  const [userResponse, teamsResponse] = await Promise.all([
    getUserDetails(context.params.id),
    getUserTeams(context.params.id),
  ]);
  const { user } = userResponse;
  const { teams } = teamsResponse;

  if (!Boolean(user)) {
    return NOT_FOUND;
  }

  const { school } = await getSchoolDetails(user.school.id);
  const data = {
    params: context.params,
    user,
    school,
    teams,
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// User

const User = (props) => {
  const { authUser, isAuthenticated } = useAuth();
  const isAuthenticatedUser = React.useMemo(
    () => authUser && authUser.uid === props.user.id,
    [authUser, props.user]
  );
  const [
    isReportingUserDialogOpen,
    setReportingUserDialogIsOpen,
  ] = useBoolean();
  const hasTeams = React.useMemo(
    () => Boolean(props.teams) && props.teams.length > 0,
    [props.teams]
  );

  return (
    <SiteLayout meta={props.user.meta}>
      {isAuthenticatedUser ? (
        <Box pos="absolute" right={6} top={6}>
          <Link
            fontWeight="bold"
            href="/edit-user"
            p={2}
            d="block"
            bg="white"
            rounded="lg"
            boxShadow="sm"
          >
            <Text as="span" pr={2}>
              <FontAwesomeIcon icon={faPencilAlt} size="sm" />
            </Text>
            Edit Your Profile
          </Link>
        </Box>
      ) : null}
      <Box bg="gray.200" h="150px" />
      <Article>
        <Flex align="center" justify="center">
          <Box mt={{ base: -50, sm: -100, md: -135 }}>
            <Box
              p={1}
              bg="white"
              rounded="full"
              boxShadow="sm"
              borderWidth={2}
              borderStyle="solid"
            >
              <Avatar
                name={props.user.fullName}
                title={props.user.fullName}
                src={props.user.gravatarUrl}
                size="2xl"
              />
            </Box>
          </Box>
        </Flex>
        <Flex as="header" align="center" justify="space-between">
          <Box>
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
          {isAuthenticated ? (
            <Box>
              <Menu>
                <MenuButton
                  as={IconButton}
                  size="sm"
                  icon={<FontAwesomeIcon icon={faEllipsisV} />}
                  aria-label="Options"
                />
                <MenuList fontSize="md">
                  <MenuItem
                    onClick={setReportingUserDialogIsOpen.on}
                    icon={<FontAwesomeIcon icon={faFlag} />}
                  >
                    Report {props.user.fullName}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          ) : null}
        </Flex>
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
            <Heading as="h3" fontSize="xl">
              Information
            </Heading>
            <Flex as="dl" flexWrap="wrap" w="100%">
              <Text as="dt" w="50%" fontWeight="bold" fontSize="md">
                Hometown
              </Text>
              {Boolean(props.user.hometown) ? (
                <Text as="dd" w="50%">
                  {props.user.hometown}
                </Text>
              ) : (
                <EmptyText as="dd" w="50%">
                  Nothing set
                </EmptyText>
              )}
              <Text as="dt" w="50%" fontWeight="bold" fontSize="md">
                Major
              </Text>
              {Boolean(props.user.major) ? (
                <Text as="dd" w="50%">
                  {props.user.major}
                </Text>
              ) : (
                <EmptyText as="dd" w="50%">
                  Nothing set
                </EmptyText>
              )}
              <Text as="dt" w="50%" fontWeight="bold" fontSize="md">
                Minor
              </Text>
              {Boolean(props.user.minor) ? (
                <Text as="dd" w="50%">
                  {props.user.minor}
                </Text>
              ) : (
                <EmptyText as="dd" w="50%">
                  Nothing set
                </EmptyText>
              )}
            </Flex>
          </Stack>
          <Stack as="section" spacing={4}>
            <Heading as="h3" fontSize="xl">
              Accounts
            </Heading>
            <AccountsList user={props.user} />
          </Stack>
          {Boolean(props.user.twitch) ? (
            <Stack as="section" spacing={4}>
              <TwitchEmbed channel={props.user.twitch} />
            </Stack>
          ) : null}
          <Stack as="section" spacing={4}>
            <Heading as="h3" fontSize="xl">
              Currently Playing
            </Heading>
            <GameList
              games={props.user.currentlyPlaying}
              emptyText={USER_EMPTY_CURRENTLY_PLAYING_TEXT}
            />
          </Stack>
          <Stack as="section" spacing={4}>
            <Heading as="h3" fontSize="xl">
              Favorite Games
            </Heading>
            <GameList
              games={props.user.favoriteGames}
              emptyText={USER_EMPTY_FAVORITE_GAMES_TEXT}
            />
          </Stack>
          <SliderLazyLoad>
            <AttendingEvents
              user={props.user}
              title="Events Attending"
              emptyText={USER_EMPTY_UPCOMING_EVENTS_TEXT}
            />
          </SliderLazyLoad>
          <Stack as="section" spacing={4}>
            <Heading as="h3" fontSize="xl">
              Teams
            </Heading>
            {!hasTeams ? (
              <EmptyText>{USER_EMPTY_TEAMS_TEXT}</EmptyText>
            ) : (
              <List>
                {props.teams.map((team) => (
                  <ListItem key={team.id}>
                    <Link
                      href={`/team/${team.id}`}
                      color="brand.500"
                      fontWeight={600}
                      fontSize="md"
                    >
                      {team.displayName}
                    </Link>
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        </Stack>
      </Article>

      {isAuthenticated ? (
        <ReportEntityDialog
          entity={{
            type: "users",
            id: props.user.id,
          }}
          pageProps={props}
          isOpen={isReportingUserDialogOpen}
          onClose={setReportingUserDialogIsOpen.off}
        />
      ) : null}
    </SiteLayout>
  );
};

////////////////////////////////////////////////////////////////////////////////
// AccountsList

const AccountsList = (props) => {
  if (props.user && props.user.hasAccounts) {
    return (
      <List display="flex" flexWrap="wrap" width="100%" styleType="none">
        {Object.keys(ACCOUNTS).map((key) => {
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

  return <EmptyText>{USER_EMPTY_ACCOUNTS_TEXT}</EmptyText>;
};

////////////////////////////////////////////////////////////////////////////////
// AccountsListItem

const AccountsListItem = (props) => {
  const toast = useToast();
  const [isHovered, setIsHovered] = useBoolean();
  const [isFocused, setIsFocused] = useBoolean();
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
      return faCopy;
    } else {
      return props.icon;
    }
  });

  return (
    <ListItem>
      <Box
        as={Button}
        onClick={() => handleCopy(props.label)}
        onMouseEnter={() => setIsHovered.on()}
        onMouseLeave={() => setIsHovered.off()}
        onFocus={() => setIsFocused.on()}
        onBlur={() => setIsFocused.off()}
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
          <Text fontSize="sm" fontWeight="normal" color="gray.600">
            {hasCopied ? "Copied!" : props.label}
          </Text>
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

const GameList = (props) => {
  if (!props.games || props.games.length === 0) {
    return <EmptyText>{props.emptyText || "No games"}</EmptyText>;
  }

  return (
    <List display="flex" flexWrap="wrap">
      {props.games.map((game) => (
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

const GameListItem = React.memo((props) => {
  return (
    <ListItem w="100px" mt={4} mr={4}>
      <GameCover name={props.name} url={props.url} />
      <GameLink name={props.name} slug={props.slug} />
    </ListItem>
  );
});

export default User;
