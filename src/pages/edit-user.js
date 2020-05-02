import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import xorBy from "lodash.xorby";
import omitBy from "lodash.omitby";
import isNil from "lodash.isnil";
import startCase from "lodash.startcase";
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
  useToast
} from "@chakra-ui/core";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import * as constants from "../constants";
import { firebase, firebaseFirestore } from "../firebase";
import timezones from "../data/timezones.json";

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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasPrefilledForm, setHasPrefilledForm] = React.useState(false);
  const [state, dispatch] = React.useReducer(formReducer, initialFormState);
  const toast = useToast();
  const handleFieldChange = React.useCallback(e => {
    dispatch({ field: e.target.name, value: e.target.value });
  }, []);
  const [favoriteGames, setFavoriteGames] = React.useState(testFavoriteGames);
  const [currentlyPlaying, setCurrentGames] = React.useState(
    testCurrentlyPlaying
  );

  const useGameSearch = searchTerm => {
    const [games, setGames] = React.useState([]);

    React.useEffect(() => {
      if (searchTerm.trim() !== "") {
        let isFresh = true;

        fetchCities(searchTerm).then(cities => {
          const testResponse = {
            data: [
              {
                id: 64980,
                cover: 45789,
                name: "J-League Supporter Soccer",
                slug: "j-league-supporter-soccer"
              },
              {
                id: 42354,
                cover: 45925,
                name: "Ultra League: Moero! Soccer Daikessen!!",
                slug: "ultra-league-moero-soccer-daikessen"
              },
              {
                id: 37661,
                cover: 26050,
                name: "Power League V",
                slug: "power-league-v"
              },
              {
                id: 38089,
                cover: 38982,
                name: "Power League II",
                slug: "power-league-ii"
              },
              {
                id: 42096,
                cover: 32877,
                name: "Power League III",
                slug: "power-league-iii"
              },
              {
                id: 23093,
                cover: 24029,
                name: "Planet Puzzle League",
                slug: "planet-puzzle-league"
              },
              {
                id: 5682,
                cover: 5817,
                name: "Major League Baseball",
                slug: "major-league-baseball"
              },
              { id: 51310, cover: 81863, name: "S4 League", slug: "s4-league" },
              { id: 103952, name: "In League", slug: "in-league" },
              {
                id: 14597,
                cover: 13074,
                name: "On the Bal: League Edition",
                slug: "on-the-bal-league-edition"
              }
            ],
            query: "League"
          };
          if (isFresh) {
            // setGames(cities);
            setGames(testResponse.data);
          }
        });
        return () => (isFresh = false);
      }
    }, [searchTerm]);

    return games;
  };

  const fetchCities = value => {
    if (CACHED_GAMES[value]) {
      return Promise.resolve(CACHED_GAMES[value]);
    }

    return fetch("https://city-search.now.sh/?" + value)
      .then(res => res.json())
      .then(result => {
        CACHED_GAMES[value] = result;
        return result;
      });
  };

  const prefillForm = () => {
    dispatch({ field: "firstName", value: props.user.firstName || "" });
    dispatch({ field: "lastName", value: props.user.lastName || "" });
    dispatch({ field: "school", value: props.user.school.id || "" });
    dispatch({ field: "status", value: props.user.status || "" });
    dispatch({ field: "major", value: props.user.major || "" });
    dispatch({ field: "minor", value: props.user.minor || "" });
    dispatch({ field: "bio", value: props.user.bio || "" });
    dispatch({ field: "timezone", value: props.user.timezone || "" });
    dispatch({ field: "hometown", value: props.user.hometown || "" });
    dispatch({
      field: "birthdate",
      value: props.user.birthdate
        ? moment(props.user.birthdate.toDate()).format("YYYY-MM-DD")
        : ""
    });
    dispatch({ field: "website", value: props.user.website || "" });
    dispatch({ field: "twitter", value: props.user.twitter || "" });
    dispatch({ field: "twitch", value: props.user.twitch || "" });
    dispatch({ field: "youtube", value: props.user.youtube || "" });
    dispatch({ field: "skype", value: props.user.skype || "" });
    dispatch({ field: "discord", value: props.user.discord || "" });
    dispatch({ field: "battlenet", value: props.user.battlenet || "" });
    dispatch({ field: "steam", value: props.user.steam || "" });
    dispatch({ field: "xbox", value: props.user.xbox || "" });
    dispatch({ field: "psn", value: props.user.psn || "" });
    setHasPrefilledForm(true);
  };

  const toggleFavoriteGame = game => {
    setFavoriteGames(xorBy(favoriteGames, [game], "id"));
  };

  const toggleCurrentGame = game => {
    setCurrentGames(xorBy(currentlyPlaying, [game], "id"));
  };

  const favoriteGamesResults = useGameSearch(state.favoriteGameSearch);
  const currentGamesResults = useGameSearch(state.currentGameSearch);

  // const searchGames = () => {
  // const test = firebase.functions().httpsCallable("searchGames");
  // test({
  //   text: "hello"
  // })
  //   .then(function(result) {
  //     result = {"data":[{"id":64980,"cover":45789,"name":"J-League Supporter Soccer","slug":"j-league-supporter-soccer"},{"id":42354,"cover":45925,"name":"Ultra League: Moero! Soccer Daikessen!!","slug":"ultra-league-moero-soccer-daikessen"},{"id":37661,"cover":26050,"name":"Power League V","slug":"power-league-v"},{"id":38089,"cover":38982,"name":"Power League II","slug":"power-league-ii"},{"id":42096,"cover":32877,"name":"Power League III","slug":"power-league-iii"},{"id":23093,"cover":24029,"name":"Planet Puzzle League","slug":"planet-puzzle-league"},{"id":5682,"cover":5817,"name":"Major League Baseball","slug":"major-league-baseball"},{"id":51310,"cover":81863,"name":"S4 League","slug":"s4-league"},{"id":103952,"name":"In League","slug":"in-league"},{"id":14597,"cover":13074,"name":"On the Bal: League Edition","slug":"on-the-bal-league-edition"}],"query":"League"}
  //     console.log("result", result);
  //   })
  //   .catch(function(error) {
  //     console.log({ error });
  //   });
  // };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!props.isAuthenticated) {
      return;
    }

    setIsSubmitting(true);

    const data = {
      firstName: state.firstName,
      lastName: state.lastName,
      status: state.status,
      hometown: state.hometown,
      birthdate: firebase.firestore.Timestamp.fromDate(
        new Date(moment(state.birthdate))
      ),
      major: state.major,
      minor: state.minor,
      bio: state.bio,
      timezone: state.timezone,
      website: state.website,
      twitter: state.twitter,
      twitch: state.twitch,
      youtube: state.youtube,
      skype: state.skype,
      discord: state.discord,
      battlenet: state.battlenet,
      steam: state.steam,
      xbox: state.xbox,
      psn: state.psn,
      school: firebaseFirestore.collection("schools").doc(state.school)
    };

    const cleanedData = omitBy(data, isNil);

    firebaseFirestore
      .collection("users")
      .doc(props.user.ref.id)
      .update(cleanedData)
      .then(() => {
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

  if (props.isAuthenticating) {
    return null;
  }

  if (!props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  const shouldDisplaySilhouette = props.appLoading;

  if (shouldDisplaySilhouette) {
    return (
      <Box as="article" my={16} px={8} mx="auto" maxW="4xl">
        <Stack spacing={10}>
          <Box bg="gray.100" w="400px" h="60px" mb={4} borderRadius="md" />
          <Stack as="section" spacing={4}>
            <Box bg="gray.100" w="75px" h="25px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100px" h="15px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
          </Stack>
          <Stack as="section" spacing={4}>
            <Box bg="gray.100" w="75px" h="25px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100px" h="15px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
          </Stack>
          <Stack as="section" spacing={4}>
            <Box bg="gray.100" w="75px" h="25px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100px" h="15px" mb={8} borderRadius="md" />
            <Box bg="gray.100" w="100%" h="200px" borderRadius="md" />
          </Stack>
        </Stack>
      </Box>
    );
  }

  if (!props.user) {
    console.error(`No user found ${props.uri}`);
    return <Redirect to="not-found" noThrow />;
  }

  if (!hasPrefilledForm) {
    prefillForm();
  }

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
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
          firstName={state.firstName}
          lastName={state.lastName}
          email={props.authenticatedUser.email}
          hometown={state.hometown}
          birthdate={state.birthdate}
          bio={state.bio}
          timezone={state.timezone}
        />
        <SchoolSection
          handleFieldChange={handleFieldChange}
          school={state.school}
          schools={props.schools}
          status={state.status}
          major={state.major}
          minor={state.minor}
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
            First Name:
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
            Last Name:
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
            Email:
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
            Hometown:
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
            Birthday:
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
            Bio:
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
            maxLength="300"
            h="150px"
          />
          <FormHelperText id="bio-helper-text">
            Describe yourself in fewer than 300 characters.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="timezone" fontSize="lg" fontWeight="bold">
            Timezone:
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
            School:
          </FormLabel>
          <ChakraSelect
            id="school"
            name="school"
            onChange={props.handleFieldChange}
            value={props.school}
            size="lg"
          >
            <option value="">Select your school</option>
            {props.schools && props.schools.length
              ? props.schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {startCase(school.name.toLowerCase())}
                  </option>
                ))
              : []}
          </ChakraSelect>
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="status" fontSize="lg" fontWeight="bold">
            Status:
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
            Major:
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
            Minor:
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
                {account.label}:
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
            Search for a game:
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
                      return <ComboboxOption key={game.id} value={game.name} />;
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
            Search for a game:
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
                      return <ComboboxOption key={game.id} value={game.name} />;
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
