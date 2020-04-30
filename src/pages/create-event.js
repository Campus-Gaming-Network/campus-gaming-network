import React from "react";
import { navigate, Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
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
  useToast
} from "@chakra-ui/core";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import PlacesAutocomplete from "react-places-autocomplete";
import { useFormFields } from "../utilities";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";
import Flex from "../components/Flex";
import Avatar from "../components/Avatar";
import { firebase, firebaseFirestore } from "../firebase";
import useLocalStorage from "../hooks/useLocalStorage";

const CreateEvent = props => {
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    description: "",
    eventHost: null
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [locationSearch, setLocationSearch] = React.useState("");
  const [startDateTime, setStartDateTime] = React.useState(new Date());
  const [endDateTime, setEndDateTime] = React.useState(new Date());
  const [placeId, setPlaceId] = React.useState("");
  const [isOnlineEvent, setIsOnlineEvent] = React.useState(false);
  const [schools, setSchools] = useLocalStorage("cgn-schools", null);
  const toast = useToast();

  // TODO: Tournament feature
  // const [isTournament, setIsTournament] = React.useState("no");

  // if (!props.isAuthenticated) {
  //   return <Redirect to="/" noThrow />;
  // }

  // if (!user) {
  //   // TODO: Handle gracefully
  //   console.log("no user");
  //   return null;
  // }

  function setLocation(address, placeId) {
    setLocationSearch(address);
    setPlaceId(placeId);
  }

  function toggleIsOnlineEvent() {
    setIsOnlineEvent(!isOnlineEvent);
  }

  async function handleSubmit(e) {
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
    // TODO: Double check the ref exists with localstorage changes
    const schoolRef = schools.find(school => school.id === props.user.school.id)
      .ref;

    let eventId;

    firebaseFirestore
      .collection("events")
      .add({
        name: fields.name,
        description: fields.description,
        isOnlineEvent,
        startDateTime: firestoreStartDateTime,
        endDateTime: firestoreEndDateTime,
        placeId,
        school: schoolRef
      })
      .then(docRef => {
        eventId = docRef.id;

        firebaseFirestore
          .collection("events")
          .doc(eventId)
          .update({ id: eventId })
          .catch(() => {
            setIsSubmitting(false);
          });

        firebaseFirestore
          .collection("event-responses")
          .add({
            user: firebaseFirestore.doc(`user/${props.user.ref.id}`),
            event: docRef,
            response: "YES",
            userDetails: {
              firstName: props.user.firstName,
              lastName: props.user.lastName,
              gravatar: props.user.gravatar
            },
            eventDetails: {
              name: fields.name,
              description: fields.description,
              startDateTime: firestoreStartDateTime,
              endDateTime: firestoreEndDateTime,
              school: schoolRef
            }
          })
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
  }

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
                Event Organizer:
              </Text>
              <Flex>
                <Avatar
                  name="Brandon Sansone"
                  size="sm"
                  src="https://api.adorable.io/avatars/285/abott249@adorable"
                  rounded
                />
                <Text ml={4} as="span" alignSelf="center">
                  Brandon Sansone
                </Text>
              </Flex>
            </Box>
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
                maxLength="300"
                h="150px"
              />
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
