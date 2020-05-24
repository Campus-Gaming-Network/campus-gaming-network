import React from "react";
import { navigate, Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import startCase from "lodash.startcase";
import uniqBy from "lodash.uniqby";
import {
  Input as ChakraInput,
  Stack,
  FormControl,
  FormLabel,
  Box,
  Button as ChakraButton,
  Textarea,
  Heading,
  Text,
  FormErrorMessage,
  Spinner,
  Checkbox,
  useToast,
  Select as ChakraSelect,
  Flex
} from "@chakra-ui/core";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox";
import Gravatar from "react-gravatar";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import PlacesAutocomplete from "react-places-autocomplete";
import { useFormFields } from "../utilities";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";
import { firebase, firebaseFirestore, firebaseAuth } from "../firebase";
import * as constants from "../constants";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAppState } from "../store";

const CACHED_GAMES = {};

const CreateEvent = props => {
  const state = useAppState();
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const user = authenticatedUser ? state.users[authenticatedUser.uid] : null;
  const school =
    authenticatedUser && user ? state.schools[user.school.id] : null;
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    description: "",
    host: "",
    gameSearch: ""
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [locationSearch, setLocationSearch] = React.useState("");
  const [startDateTime, setStartDateTime] = React.useState(new Date());
  const [endDateTime, setEndDateTime] = React.useState(new Date());
  const [placeId, setPlaceId] = React.useState("");
  const [isOnlineEvent, setIsOnlineEvent] = React.useState(false);
  const toast = useToast();
  // TODO: Tournament feature
  // const [isTournament, setIsTournament] = React.useState("no");

  const setLocation = (address, placeId) => {
    setLocationSearch(address);
    setPlaceId(placeId);
  };

  const toggleIsOnlineEvent = () => {
    setIsOnlineEvent(!isOnlineEvent);
  };

  const useGameSearch = searchTerm => {
    const [games, setGames] = React.useState([]);

    React.useEffect(() => {
      if (searchTerm.trim() !== "") {
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

  const gamesResults = useGameSearch(fields.gameSearch);

  const handleSubmit = async e => {
    e.preventDefault();

    setIsSubmitting(true);

    // Double check the address for a geocode if they blur or something
    // Probably want to save the address and lat/long
    // If we save the placeId, it may be easier to render the map for that place
    geocodeByAddress(locationSearch)
      .then(results => {
        console.log({ results });
      })
      .catch(error => {
        console.error({ error });
      });

    const firestoreStartDateTime = firebase.firestore.Timestamp.fromDate(
      startDateTime
    );
    const firestoreEndDateTime = firebase.firestore.Timestamp.fromDate(
      endDateTime
    );
    const schoolDocRef = firebaseFirestore
      .collection("schools")
      .doc(user.school.id);
    const userDocRef = firebaseFirestore.collection("users").doc(user.id);

    const games = uniqBy(Object.values(CACHED_GAMES).flat(), "id");
    const selectedGame = games.find(
      game =>
        game.name.toLowerCase().trim() ===
        fields.gameSearch.toLowerCase().trim()
    );

    const eventData = {
      creator: userDocRef,
      name: fields.name,
      description: fields.description,
      isOnlineEvent,
      startDateTime: firestoreStartDateTime,
      endDateTime: firestoreEndDateTime,
      placeId,
      school: schoolDocRef,
      schoolDetails: {
        name: school.name
      },
      game: selectedGame || {
        name: fields.gameSearch.trim()
      }
    };

    let eventId;

    firebaseFirestore
      .collection("events")
      .add(eventData)
      .then(eventDocRef => {
        eventId = eventDocRef.id;

        firebaseFirestore
          .collection("events")
          .doc(eventId)
          .update({ id: eventId })
          .catch(() => {
            setIsSubmitting(false);
          });

        const eventResponseData = {
          user: userDocRef,
          event: eventDocRef,
          school: schoolDocRef,
          response: "YES",
          userDetails: {
            firstName: user.firstName,
            lastName: user.lastName,
            gravatar: user.gravatar
          },
          eventDetails: {
            name: fields.name,
            description: fields.description,
            startDateTime: firestoreStartDateTime,
            endDateTime: firestoreEndDateTime
          },
          schoolDetails: {
            name: school.name
          }
        };

        firebaseFirestore
          .collection("event-responses")
          .add(eventResponseData)
          .then(() => {
            toast({
              title: "Event created.",
              description:
                "Your event has been created. You will be redirected...",
              status: "success",
              isClosable: true
            });
            setTimeout(() => {
              navigate(`/event/${eventId}`);
            }, 2000);
          })
          .catch(() => {
            setIsSubmitting(false);
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

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
      <Stack as="form" spacing={32} onSubmit={handleSubmit}>
        <Heading as="h1" size="2xl">
          Create an Event
        </Heading>
        <Box
          as="fieldset"
          borderWidth="1px"
          boxShadow="lg"
          rounded="lg"
          bg="white"
          pos="relative"
        >
          <Box pos="absolute" top="-5rem">
            <Text as="legend" fontWeight="bold" fontSize="2xl">
              Details
            </Text>
            <Text color="gray.500">The information for event goers.</Text>
          </Box>
          <Stack spacing={6} p={8}>
            <Box>
              <Text fontSize="lg" fontWeight="bold" pb={2}>
                Event Creator:
              </Text>
              <Flex>
                <Gravatar
                  default={constants.GRAVATAR.DEFAULT}
                  rating={constants.GRAVATAR.RA}
                  md5={user.gravatar}
                  className="h-10 w-10 rounded-full"
                />
                <Text ml={4} as="span" alignSelf="center">
                  {user.fullName}
                </Text>
              </Flex>
            </Box>
            <FormControl isRequired>
              <FormLabel htmlFor="host" fontSize="lg" fontWeight="bold">
                Event Host:
              </FormLabel>
              <ChakraSelect
                id="host"
                name="host"
                onChange={props.handleFieldChange}
                value={props.host}
                size="lg"
              >
                <option value="">Select the host of the event</option>
                <option value="user">{user.fullName} (You)</option>
                <option value="school">
                  {startCase(school.name.toLowerCase())}
                </option>
              </ChakraSelect>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="name" fontSize="lg" fontWeight="bold">
                Event Name:
              </FormLabel>
              <ChakraInput
                id="name"
                name="name"
                type="text"
                placeholder="CSGO and Pizza"
                maxLength="64"
                onChange={handleFieldChange}
                value={fields.name}
                size="lg"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="location" fontSize="lg" fontWeight="bold">
                Location:
              </FormLabel>
              <Stack>
                <PlacesAutocomplete
                  value={locationSearch}
                  onChange={value => setLocationSearch(value)}
                  onSelect={(address, placeId) => setLocation(address, placeId)}
                  debounce={600}
                  shouldFetchSuggestions={locationSearch.length >= 3}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading
                  }) => (
                    <div>
                      <ChakraInput
                        {...getInputProps({
                          placeholder: "Add a place or address",
                          className: "location-search-input",
                          disabled: isOnlineEvent
                        })}
                        size="lg"
                      />
                      <Box className="autocomplete-dropdown-container">
                        {loading && (
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
                        )}
                        {suggestions.map((suggestion, index, arr) => {
                          const isLast = arr.length - 1 === index;
                          const style = {
                            backgroundColor: suggestion.active
                              ? "#edf2f7"
                              : "#ffffff",
                            cursor: "pointer",
                            padding: "12px",
                            borderLeft: "1px solid #e2e8f0",
                            borderRight: "1px solid #e2e8f0",
                            borderBottom: isLast
                              ? "1px solid #e2e8f0"
                              : undefined,
                            borderBottomLeftRadius: "0.25rem",
                            borderBottomRightRadius: "0.25rem"
                          };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                style
                              })}
                            >
                              <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                className="mr-4"
                              />
                              <Text as="span">{suggestion.description}</Text>
                            </div>
                          );
                        })}
                      </Box>
                    </div>
                  )}
                </PlacesAutocomplete>
                <Text>or</Text>
                <Checkbox
                  size="lg"
                  disabled={!!placeId}
                  value={false}
                  onChange={toggleIsOnlineEvent}
                >
                  This is an online event
                </Checkbox>
              </Stack>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="description" fontSize="lg" fontWeight="bold">
                Description:
              </FormLabel>
              <Textarea
                id="description"
                name="description"
                onChange={handleFieldChange}
                value={fields.description}
                placeholder="Tell people what your event is about."
                size="lg"
                resize="vertical"
                maxLength="3000"
                h="150px"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="gameSearch" fontSize="lg" fontWeight="bold">
                Game:
              </FormLabel>
              <Combobox aria-label="Games">
                <ComboboxInput
                  id="gameSearch"
                  name="gameSearch"
                  placeholder="The game being played"
                  onChange={handleFieldChange}
                />
                {gamesResults && (
                  <ComboboxPopover>
                    {gamesResults.length > 0 ? (
                      <ComboboxList>
                        {gamesResults.map(game => {
                          return (
                            <ComboboxOption key={game.id} value={game.name} />
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
            <FormControl isRequired isInvalid={!startDateTime}>
              <FormLabel
                htmlFor="startDateTime"
                fontSize="lg"
                fontWeight="bold"
              >
                Starts:
              </FormLabel>
              <DateTimePicker
                id="startDateTime"
                name="startDateTime"
                value={startDateTime}
                onChange={value => setStartDateTime(value)}
                min={new Date()}
                step={15}
              />
              <FormErrorMessage>
                Please select an end date and time.
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={!endDateTime}>
              <FormLabel htmlFor="endDateTime" fontSize="lg" fontWeight="bold">
                Ends:
              </FormLabel>
              <DateTimePicker
                id="endDateTime"
                name="endDateTime"
                value={endDateTime}
                onChange={value => setEndDateTime(value)}
                min={new Date()}
                step={15}
              />
              <FormErrorMessage>
                Please select an end date and time.
              </FormErrorMessage>
            </FormControl>
            {/* TODO: Tournament feature */}
            {/* <FormControl>
              <FormLabel htmlFor="isTournament" fontSize="lg" fontWeight="bold">
                Is this event a tournament?
              </FormLabel>
              <RadioGroup
                id="isTournament"
                name="isTournament"
                onChange={e => setIsTournament(e.target.value)}
                value={isTournament}
                spacing={0}
              >
                <Radio size="md" value="yes">Yes</Radio>
                <Radio size="md" value="no">No</Radio>
              </RadioGroup>
            </FormControl>
            {isTournament === "yes" ? (
              <React.Fragment>
                <span>TODO: Tournament form</span>
              </React.Fragment>
            ) : null} */}
          </Stack>
        </Box>
        <ChakraButton
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          mt={-12}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Create Event"}
        </ChakraButton>
      </Stack>
    </Box>
  );
};

export default CreateEvent;
