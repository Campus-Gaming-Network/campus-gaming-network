import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import xorBy from "lodash.xorby";
import omitBy from "lodash.omitby";
import isNil from "lodash.isnil";
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
import GameSearch from "../components/GameSearch";

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

const formReducer = (state, { field, value }) => {
  return {
    ...state,
    [field]: value
  };
};

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
  const [favoriteGames, setFavoriteGames] = React.useState([]);
  const [currentlyPlaying, setCurrentGames] = React.useState([]);

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
    setCurrentGames(user.currentlyPlaying || []);
    setFavoriteGames(user.favoriteGames || []);
    setHasPrefilledForm(true);
  };

  const toggleFavoriteGame = game => {
    setFavoriteGames(xorBy(favoriteGames, [game], "id"));
  };

  const toggleCurrentGame = game => {
    setCurrentGames(xorBy(currentlyPlaying, [game], "id"));
  };

  const onFavoriteGameSelect = game => {
    toggleFavoriteGame(game);
  };

  const onCurrentlyPlayingGameSelect = game => {
    toggleCurrentGame(game);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!authenticatedUser) {
      return;
    }

    setIsSubmitting(true);

    const schoolDocRef = firebaseFirestore
      .collection("schools")
      .doc(formState.school);

    const data = {
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      status: formState.status,
      hometown: formState.hometown.trim(),
      birthdate: formState.birthdate
        ? firebase.firestore.Timestamp.fromDate(
            new Date(moment(formState.birthdate))
          )
        : null,
      major: formState.major.trim(),
      minor: formState.minor.trim(),
      bio: formState.bio.trim(),
      timezone: formState.timezone,
      website: formState.website.trim(),
      twitter: formState.twitter.trim(),
      twitch: formState.twitch.trim(),
      youtube: formState.youtube.trim(),
      skype: formState.skype.trim(),
      discord: formState.discord.trim(),
      battlenet: formState.battlenet.trim(),
      steam: formState.steam.trim(),
      xbox: formState.xbox.trim(),
      psn: formState.psn.trim(),
      school: schoolDocRef,
      currentlyPlaying,
      favoriteGames
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
    <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
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
          battlenet={formState.battlenet}
          discord={formState.discord}
          psn={formState.psn}
          skype={formState.skype}
          steam={formState.steam}
          twitch={formState.twitch}
          twitter={formState.twitter}
          website={formState.website}
          xbox={formState.xbox}
          youtube={formState.youtube}
        />
        <FavoriteGamesSection
          handleFieldChange={handleFieldChange}
          toggleFavoriteGame={toggleFavoriteGame}
          favoriteGames={favoriteGames}
          onGameSelect={onFavoriteGameSelect}
        />
        <CurrentlyPlayingSection
          handleFieldChange={handleFieldChange}
          toggleCurrentGame={toggleCurrentGame}
          currentlyPlaying={currentlyPlaying}
          onGameSelect={onCurrentlyPlayingGameSelect}
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
  // TODO: Make a constant for 1000
  const bioCharactersRemaining = props.bio ? 1000 - props.bio.length : 1000;

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
            Describe yourself in fewer than 1000 characters.{" "}
            <Text
              as="span"
              color={bioCharactersRemaining <= 0 ? "red.500" : undefined}
            >
              {bioCharactersRemaining} characters remaining.
            </Text>
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
        <FormControl isRequired>
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
  console.log({ props });
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
  // TODO: Turn into constant
  const favoriteGameLimit = 5;

  console.log({ props });

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
          <GameSearch
            id="favoriteGameSearch"
            name="favoriteGameSearch"
            onSelect={props.onGameSelect}
            clearInputOnSelect={true}
            disabled={props.favoriteGames.length === favoriteGameLimit}
          />
        </FormControl>
        <Stack spacing={2}>
          <Text fontWeight="bold">
            Your favorites{" "}
            <Text
              as="span"
              color={`${
                props.favoriteGames.length === favoriteGameLimit
                  ? "red.500"
                  : undefined
              }`}
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
                  {game.cover ? (
                    <Image
                      src={`https:${game.cover.url}`}
                      alt={`The cover art for ${game.name}`}
                    />
                  ) : null}
                  <Tooltip label={game.name}>
                    <Text fontSize="sm" lineHeight="1.2" p={2} isTruncated>
                      {game.name}
                    </Text>
                  </Tooltip>
                  <Tooltip
                    label={`Remove ${game.name} from favorite games list`}
                  >
                    <ChakraButton
                      size="xs"
                      variant="ghost"
                      variantColor="red"
                      onClick={() => props.toggleFavoriteGame(game)}
                    >
                      Remove
                    </ChakraButton>
                  </Tooltip>
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
  // TODO: Turn into constant
  const currentlyPlayingLimit = 5;

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
          <GameSearch
            id="currentGameSearch"
            name="currentGameSearch"
            onSelect={props.onGameSelect}
            clearInputOnSelect={true}
            disabled={props.currentlyPlaying.length === currentlyPlayingLimit}
          />
        </FormControl>
        <Stack spacing={2}>
          <Text fontWeight="bold">
            What you’re playing{" "}
            <Text
              as="span"
              color={`${
                props.currentlyPlaying.length === currentlyPlayingLimit
                  ? "red.500"
                  : undefined
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
                  {game.cover ? (
                    <Image
                      src={`https:${game.cover.url}`}
                      alt={`The cover art for ${game.name}`}
                    />
                  ) : null}
                  <Tooltip label={game.name}>
                    <Text fontSize="sm" lineHeight="1.2" p={2} isTruncated>
                      {game.name}
                    </Text>
                  </Tooltip>
                  <Tooltip
                    label={`Remove ${game.name} from currently playing list`}
                  >
                    <ChakraButton
                      size="xs"
                      variant="ghost"
                      variantColor="red"
                      onClick={() => props.toggleCurrentGame(game)}
                    >
                      Remove
                    </ChakraButton>
                  </Tooltip>
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
