import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import xorBy from "lodash.xorby";
import omitBy from "lodash.omitby";
import isNil from "lodash.isnil";
import startCase from "lodash.startcase";
// eslint-disable-next-line no-unused-vars
import uniqBy from "lodash.uniqby";
import moment from "moment";
import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  InputLeftAddon,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Select as ChakraSelect,
  Button as ChakraButton,
  Textarea,
  Heading,
  Text,
  Image,
  Tooltip,
  Flex,
  useToast
} from "@chakra-ui/core";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText
} from "@reach/combobox";
import * as constants from "../constants";
import { firebase, firebaseFirestore, firebaseAuth } from "../firebase";
import timezones from "../data/timezones.json";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";
import SchoolSelect from "../components/SchoolSelect";

const initialFormState = {
  firstName: "",
  lastName: "",
  school: "",
  status: "",
  major: "",
  minor: "",
  bio: "",
  timezone: "",
  hometown: "",
  birthdate: "",
  website: "",
  twitter: "",
  twitch: "",
  youtube: "",
  skype: "",
  discord: "",
  battlenet: "",
  steam: "",
  xbox: "",
  psn: "",
  favoriteGameSearch: "",
  currentGameSearch: ""
};

const CACHED_GAMES = {};

const formReducer = (state, { field, value }) => {
  return {
    ...state,
    [field]: value
  };
};

const testFavoriteGames = Array.from({ length: 1 }, () => ({
  id: Math.floor(Math.random() * 100),
  name: "League of Legends",
  picture: constants.TEST_VIDEO_GAME_COVER
}));
const testCurrentlyPlaying = Array.from({ length: 5 }, () => ({
  id: Math.floor(Math.random() * 100),
  name: "League of Legends",
  picture: constants.TEST_VIDEO_GAME_COVER
}));

const EditUser = props => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const user = authenticatedUser ? state.users[authenticatedUser.uid] : null;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasPrefilledForm, setHasPrefilledForm] = React.useState(false);
  const [formState, formDispatch] = React.useReducer(
    formReducer,
    initialFormState
  );
  const toast = useToast();
  const handleFieldChange = React.useCallback(e => {
    formDispatch({ field: e.target.name, value: e.target.value });
  }, []);
  const [favoriteGames, setFavoriteGames] = React.useState(testFavoriteGames);
  const [currentlyPlaying, setCurrentGames] = React.useState(
    testCurrentlyPlaying
  );

  const useGameSearch = searchTerm => {
    const [games, setGames] = React.useState([]);

    React.useEffect(() => {
      const _searchTerm = searchTerm.trim();
      if (_searchTerm !== "" && _searchTerm.length > 3) {
        let isFresh = true;

        fetchGames(searchTerm).then(games => {
          if (isFresh) {
            setGames(games);
          }
        });
        return () => (isFresh = false);
      }
    }, [searchTerm]);

    return games;
  };

  const fetchGames = value => {
    if (CACHED_GAMES[value]) {
      return Promise.resolve(CACHED_GAMES[value]);
    }

    const searchGames = firebase.functions().httpsCallable("searchGames");

    return searchGames({ text: value }).then(result => {
      CACHED_GAMES[value] = result.data.games;
      return result.data.games;
    });
  };

  const prefillForm = () => {
    formDispatch({ field: "firstName", value: user.firstName || "" });
    formDispatch({ field: "lastName", value: user.lastName || "" });
    formDispatch({ field: "school", value: user.school.id || "" });
    formDispatch({ field: "status", value: user.status || "" });
    formDispatch({ field: "major", value: user.major || "" });
    formDispatch({ field: "minor", value: user.minor || "" });
    formDispatch({ field: "bio", value: user.bio || "" });
    formDispatch({ field: "timezone", value: user.timezone || "" });
    formDispatch({ field: "hometown", value: user.hometown || "" });
    formDispatch({
      field: "birthdate",
      value: user.birthdate
        ? moment(user.birthdate.toDate()).format("YYYY-MM-DD")
        : ""
    });
    formDispatch({ field: "website", value: user.website || "" });
    formDispatch({ field: "twitter", value: user.twitter || "" });
    formDispatch({ field: "twitch", value: user.twitch || "" });
    formDispatch({ field: "youtube", value: user.youtube || "" });
    formDispatch({ field: "skype", value: user.skype || "" });
    formDispatch({ field: "discord", value: user.discord || "" });
    formDispatch({ field: "battlenet", value: user.battlenet || "" });
    formDispatch({ field: "steam", value: user.steam || "" });
    formDispatch({ field: "xbox", value: user.xbox || "" });
    formDispatch({ field: "psn", value: user.psn || "" });
    setHasPrefilledForm(true);
  };

  const toggleFavoriteGame = game => {
    setFavoriteGames(xorBy(favoriteGames, [game], "id"));
  };

  const toggleCurrentGame = game => {
    setCurrentGames(xorBy(currentlyPlaying, [game], "id"));
  };

  const favoriteGamesResults = useGameSearch(formState.favoriteGameSearch);
  const currentGamesResults = useGameSearch(formState.currentGameSearch);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!authenticatedUser) {
      return;
    }

    setIsSubmitting(true);

    const schoolDocRef = firebaseFirestore
      .collection("schools")
      .doc(formState.school);

    // TODO:
    // const games = uniqBy(Object.values(CACHED_GAMES).flat(), "id");
    // const selectedGame = games.find(
    //   game => game.name.toLowerCase().trim() === fields.gameSearch.toLowerCase().trim()
    // );

    const data = {
      firstName: formState.firstName,
      lastName: formState.lastName,
      status: formState.status,
      hometown: formState.hometown,
      birthdate: formState.birthdate
        ? firebase.firestore.Timestamp.fromDate(
            new Date(moment(formState.birthdate))
          )
        : null,
      major: formState.major,
      minor: formState.minor,
      bio: formState.bio,
      timezone: formState.timezone,
      website: formState.website,
      twitter: formState.twitter,
      twitch: formState.twitch,
      youtube: formState.youtube,
      skype: formState.skype,
      discord: formState.discord,
      battlenet: formState.battlenet,
      steam: formState.steam,
      xbox: formState.xbox,
      psn: formState.psn,
      school: schoolDocRef
    };

    const cleanedData = omitBy(data, isNil);

    firebaseFirestore
      .collection("users")
      .doc(user.id)
      .update(cleanedData)
      .then(() => {
        dispatch({
          type: ACTION_TYPES.SET_USER,
          payload: {
            ...user,
            ...cleanedData
          }
        });
        setIsSubmitting(false);
        toast({
          title: "Profile updated.",
          description: "Your profile has been updated.",
          status: "success",
          isClosable: true
        });
      })
      .catch(error => {
        setIsSubmitting(false);
        toast({
          title: "An error occurred.",
          description: error,
          status: "error",
          isClosable: true
        });
      });
  };

  if (isAuthenticating) {
    return null;
  }

  if (!authenticatedUser) {
    return <Redirect to="/" noThrow />;
  }

  if (!user) {
    console.error(`No user found ${props.uri}`);
    return <Redirect to="../../not-found" noThrow />;
  }

  if (!hasPrefilledForm) {
    prefillForm();
  }

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
      <Stack as="form" spacing={32} onSubmit={handleSubmit}>
        <Heading as="h1" size="2xl">
          Your Profile
        </Heading>
        <ChakraButton
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          mt={-12}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Update Profile"}
        </ChakraButton>
        <DetailSection
          handleFieldChange={handleFieldChange}
          firstName={formState.firstName}
          lastName={formState.lastName}
          email={authenticatedUser.email}
          hometown={formState.hometown}
          birthdate={formState.birthdate}
          bio={formState.bio}
          timezone={formState.timezone}
        />
        <SchoolSection
          handleFieldChange={handleFieldChange}
          school={formState.school}
          status={formState.status}
          major={formState.major}
          minor={formState.minor}
        />
        <SocialAccountsSection
          handleFieldChange={handleFieldChange}
          {...Object.keys(constants.ACCOUNTS).reduce(
            (acc, cur) => ({
              ...acc,
              [cur]: state[cur]
            }),
            {}
          )}
        />
        <FavoriteGamesSection
          handleFieldChange={handleFieldChange}
          toggleFavoriteGame={toggleFavoriteGame}
          favoriteGames={favoriteGames}
          favoriteGamesResults={favoriteGamesResults}
        />
        <CurrentlyPlayingSection
          handleFieldChange={handleFieldChange}
          toggleCurrentGame={toggleCurrentGame}
          currentlyPlaying={currentlyPlaying}
          currentGamesResults={currentGamesResults}
        />
        <ChakraButton
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          mt={-12}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Update Profile"}
        </ChakraButton>
      </Stack>
    </Box>
  );
};

const DetailSection = React.memo(props => {
  return (
    <Box
      as="fieldset"
      borderWidth="1px"
      boxShadow="lg"
      rounded="lg"
      bg="white"
      pos="relative"
      mb={32}
    >
      <Box pos="absolute" top="-5rem">
        <Text as="legend" fontWeight="bold" fontSize="2xl">
          Details
        </Text>
        <Text color="gray.500">Personal information about you.</Text>
      </Box>
      <Stack spacing={6} p={8}>
        <FormControl isRequired>
          <FormLabel htmlFor="firstName" fontSize="lg" fontWeight="bold">
            First Name
          </FormLabel>
          <ChakraInput
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Brandon"
            onChange={props.handleFieldChange}
            value={props.firstName}
            size="lg"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="lastName" fontSize="lg" fontWeight="bold">
            Last Name
          </FormLabel>
          <ChakraInput
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Sansone"
            onChange={props.handleFieldChange}
            value={props.lastName}
            roundedLeft="0"
            size="lg"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
            Email
          </FormLabel>
          <ChakraInput
            id="email"
            name="email"
            type="email"
            placeholder="jdoe@gmail.com"
            value={props.email}
            size="lg"
            disabled
            aria-describedby="email-helper-text"
          />
          <FormHelperText id="email-helper-text">
            Your email cannot be changed.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="hometown" fontSize="lg" fontWeight="bold">
            Hometown
          </FormLabel>
          <ChakraInput
            id="hometown"
            name="hometown"
            type="text"
            placeholder="Chicago, IL"
            onChange={props.handleFieldChange}
            value={props.hometown}
            size="lg"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="birthdate" fontSize="lg" fontWeight="bold">
            Birthday
          </FormLabel>
          <ChakraInput
            id="birthdate"
            name="birthdate"
            type="date"
            onChange={props.handleFieldChange}
            value={props.birthdate}
            size="lg"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="bio" fontSize="lg" fontWeight="bold">
            Bio
          </FormLabel>
          <Textarea
            id="bio"
            name="bio"
            onChange={props.handleFieldChange}
            value={props.bio}
            placeholder="Add your bio"
            size="lg"
            resize="vertical"
            aria-describedby="bio-helper-text"
            maxLength="1000"
            h="150px"
          />
          <FormHelperText id="bio-helper-text">
            Describe yourself in fewer than 1000 characters.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="timezone" fontSize="lg" fontWeight="bold">
            Timezone
          </FormLabel>
          <ChakraSelect
            id="timezone"
            name="timezone"
            onChange={props.handleFieldChange}
            value={props.timezone}
            size="lg"
            aria-describedby="timezone-helper-text"
          >
            <option value="">Select your timezone</option>
            {timezones.map(status => (
              <option key={status.value} value={status.value}>
                {status.name}
              </option>
            ))}
          </ChakraSelect>
          <FormHelperText id="timezone-helper-text">
            For displaying dates and times correctly.
          </FormHelperText>
        </FormControl>
      </Stack>
    </Box>
  );
});

const SchoolSection = React.memo(props => {
  return (
    <Box
      as="fieldset"
      borderWidth="1px"
      boxShadow="lg"
      rounded="lg"
      bg="white"
      pos="relative"
      mb={32}
    >
      <Box pos="absolute" top="-5rem">
        <Text as="legend" fontWeight="bold" fontSize="2xl">
          School
        </Text>
        <Text color="gray.500">Where you study, what you study.</Text>
      </Box>
      <Stack spacing={6} p={8}>
        <FormControl>
          <FormLabel htmlFor="school" fontSize="lg" fontWeight="bold">
            School
          </FormLabel>
          <SchoolSelect
            onChange={props.handleFieldChange}
            value={props.school}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="status" fontSize="lg" fontWeight="bold">
            Status
          </FormLabel>
          <ChakraSelect
            id="status"
            name="status"
            onChange={props.handleFieldChange}
            value={props.status}
            size="lg"
          >
            {constants.STUDENT_STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </ChakraSelect>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="major" fontSize="lg" fontWeight="bold">
            Major
          </FormLabel>
          <ChakraInput
            id="major"
            name="major"
            type="text"
            onChange={props.handleFieldChange}
            value={props.major}
            size="lg"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="minor" fontSize="lg" fontWeight="bold">
            Minor
          </FormLabel>
          <ChakraInput
            id="minor"
            name="minor"
            type="text"
            onChange={props.handleFieldChange}
            value={props.minor}
            size="lg"
          />
        </FormControl>
      </Stack>
    </Box>
  );
});

const SocialAccountsSection = React.memo(props => {
  return (
    <Box
      as="fieldset"
      borderWidth="1px"
      boxShadow="lg"
      rounded="lg"
      bg="white"
      pos="relative"
      mb={32}
    >
      <Box pos="absolute" top="-5rem">
        <Text as="legend" fontWeight="bold" fontSize="2xl">
          Social Accounts
        </Text>
        <Text color="gray.500">Other places where people can find you at.</Text>
      </Box>
      <Stack spacing={6} p={8}>
        {Object.keys(constants.ACCOUNTS).map(id => {
          const account = constants.ACCOUNTS[id];

          return (
            <FormControl key={id}>
              <FormLabel htmlFor={id} fontSize="lg" fontWeight="bold">
                {account.label}
              </FormLabel>
              <ChakraInputGroup size="lg">
                {account.icon || !!account.url ? (
                  <InputLeftAddon
                    children={
                      <React.Fragment>
                        <FontAwesomeIcon icon={account.icon} />
                        {!!account.url ? (
                          <Text ml={4}>{account.url}</Text>
                        ) : null}
                      </React.Fragment>
                    }
                  />
                ) : null}
                <ChakraInput
                  id={id}
                  name={id}
                  type="text"
                  placeholder={account.placeholder}
                  onChange={props.handleFieldChange}
                  value={props[id]}
                  roundedLeft="0"
                />
              </ChakraInputGroup>
            </FormControl>
          );
        })}
      </Stack>
    </Box>
  );
});

const FavoriteGamesSection = React.memo(props => {
  console.log("props.favoriteGamesResults", props.favoriteGamesResults);
  return (
    <Box
      as="fieldset"
      borderWidth="1px"
      boxShadow="lg"
      rounded="lg"
      bg="white"
      pos="relative"
      mb={32}
    >
      <Box pos="absolute" top="-5rem">
        <Text as="legend" fontWeight="bold" fontSize="2xl">
          Favorite Games
        </Text>
        <Text color="gray.500">
          Your top 5 favorite games (if you can even choose).
        </Text>
      </Box>
      <Stack spacing={6} p={8}>
        <FormControl>
          <FormLabel
            htmlFor="favoriteGameSearch"
            fontSize="lg"
            fontWeight="bold"
          >
            Search for a game
          </FormLabel>
          <Combobox aria-label="Games">
            <ComboboxInput
              id="favoriteGameSearch"
              name="favoriteGameSearch"
              placeholder="Search"
              onChange={props.handleFieldChange}
              disabled={props.favoriteGames.length === 5}
            />
            {props.favoriteGamesResults && (
              <ComboboxPopover>
                {props.favoriteGamesResults.length > 0 ? (
                  <ComboboxList>
                    {props.favoriteGamesResults.map(game => {
                      return (
                        <ComboboxOption key={game.id} value={game.name}>
                          <Flex alignItems="center" width="100%">
                            {game.cover ? (
                              <Image
                                src={`https:${game.cover.url}`}
                                size="40px"
                                mr={6}
                                objectFit="cover"
                                alt={`The cover art for ${game.name}`}
                              />
                            ) : null}
                            <ComboboxOptionText />
                          </Flex>
                        </ComboboxOption>
                      );
                    })}
                  </ComboboxList>
                ) : (
                  <Text as="span" ma={8} d="block">
                    No results found
                  </Text>
                )}
              </ComboboxPopover>
            )}
          </Combobox>
        </FormControl>
        <Stack spacing={2}>
          <Text fontWeight="bold">
            Your favorites
            <Text
              as="span"
              color={`${props.favoriteGames.length === 5 ? "red" : undefined}`}
            >
              ({props.favoriteGames.length}/5)
            </Text>
          </Text>
          :
          {props.favoriteGames.length === 0 ? (
            <Text color="gray.500">You haven’t selected any.</Text>
          ) : (
            <Stack isInline>
              {props.favoriteGames.map(game => (
                <Box key={game.id} w="100px" textAlign="center" mt={4}>
                  <Image
                    src={game.picture}
                    alt={`The cover art for ${game.name}`}
                  />
                  <Tooltip label={game.name}>
                    <Text fontSize="sm" lineHeight="1.2" p={2} isTruncated>
                      {game.name}
                    </Text>
                  </Tooltip>
                  <ChakraButton
                    size="xs"
                    variant="ghost"
                    variantColor="red"
                    onClick={() => props.toggleFavoriteGame(game)}
                  >
                    Remove
                  </ChakraButton>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
});

const CurrentlyPlayingSection = React.memo(props => {
  return (
    <Box
      as="fieldset"
      borderWidth="1px"
      boxShadow="lg"
      rounded="lg"
      bg="white"
      pos="relative"
      mb={32}
    >
      <Box pos="absolute" top="-5rem">
        <Text as="legend" fontWeight="bold" fontSize="2xl">
          Currently Playing
        </Text>
        <Text color="gray.500">What are you currently playing? Max 5.</Text>
      </Box>
      <Stack spacing={6} p={8}>
        <FormControl>
          <FormLabel
            htmlFor="currentGameSearch"
            fontSize="lg"
            fontWeight="bold"
          >
            Search for a game
          </FormLabel>
          <Combobox aria-label="Games">
            <ComboboxInput
              id="currentGameSearch"
              name="currentGameSearch"
              placeholder="Search"
              onChange={props.handleFieldChange}
              disabled={props.currentGamesResults.length === 5}
            />
            {props.currentGamesResults && (
              <ComboboxPopover>
                {props.currentGamesResults.length > 0 ? (
                  <ComboboxList>
                    {props.currentGamesResults.map(game => {
                      return (
                        <ComboboxOption key={game.id} value={game.name}>
                          <Flex alignItems="center" width="100%">
                            {game.cover ? (
                              <Image
                                src={`https:${game.cover.url}`}
                                size="40px"
                                mr={6}
                                objectFit="cover"
                                alt={`The cover art for ${game.name}`}
                              />
                            ) : null}
                            <ComboboxOptionText />
                          </Flex>
                        </ComboboxOption>
                      );
                    })}
                  </ComboboxList>
                ) : (
                  <Text as="span" ma={8} d="block">
                    No results found
                  </Text>
                )}
              </ComboboxPopover>
            )}
          </Combobox>
        </FormControl>
        <Stack spacing={2}>
          <Text fontWeight="bold">
            What you’re playing{" "}
            <Text
              as="span"
              color={`${
                props.currentlyPlaying.length === 5 ? "red.500" : undefined
              }`}
            >
              ({props.currentlyPlaying.length}/5)
            </Text>
          </Text>
          {props.currentlyPlaying.length === 0 ? (
            <Text color="gray.500">You haven’t selected any.</Text>
          ) : (
            <Stack isInline spacing={12} wrap="wrap">
              {props.currentlyPlaying.map(game => (
                <Box key={game.id} w="100px" textAlign="center" mt={4}>
                  <Image
                    src={game.picture}
                    alt={`The cover art for ${game.name}`}
                  />
                  <Tooltip label={game.name}>
                    <Text fontSize="sm" lineHeight="1.2" p={2} isTruncated>
                      {game.name}
                    </Text>
                  </Tooltip>
                  <ChakraButton
                    size="xs"
                    variant="ghost"
                    variantColor="red"
                    onClick={() => props.toggleCurrentGame(game)}
                  >
                    Remove
                  </ChakraButton>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
});

export default EditUser;
