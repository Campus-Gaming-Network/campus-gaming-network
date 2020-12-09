// Libraries
import React from "react";
import { navigate, Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import startCase from "lodash.startcase";
import isEmpty from "lodash.isempty";
import {
  Input,
  Stack,
  FormControl,
  FormLabel,
  Box,
  Button,
  Textarea,
  Heading,
  Text,
  FormErrorMessage,
  Spinner,
  Checkbox,
  useToast,
  Select,
  Flex,
  Avatar,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from "@chakra-ui/react";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";
import { DateTime } from "luxon";
import { useAuthState } from "react-firebase-hooks/auth";

// Other
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";
import { firebase, firebaseFirestore, firebaseAuth } from "../firebase";

// Components
import GameSearch from "components/GameSearch";
import GameCover from "components/GameCover";

// Hooks
import useFetchEventDetails from "hooks/useFetchEventDetails";

// Utilities
import { mapEventResponse, mapEvent } from "../utilities";
import { validateCreateEvent } from "../utilities/validation";

// Constants
import { COLLECTIONS } from "../constants";

const initialFormState = {
  name: "",
  description: "",
  game: {},
  startDateTime: new Date(),
  endDateTime: new Date(),
  placeId: "",
  isOnlineEvent: false,
  location: ""
};

const formReducer = (state, { field, value }) => {
  return {
    ...state,
    [field]: value
  };
};

////////////////////////////////////////////////////////////////////////////////
// CreateEvent

const CreateEvent = props => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const cancelRef = React.useRef();
  const deleteEventRef = React.useRef();
  const [hasPrefilledForm, setHasPrefilledForm] = React.useState(false);
  const [authenticatedUser] = useAuthState(firebaseAuth);
  const [formState, formDispatch] = React.useReducer(
    formReducer,
    initialFormState
  );
  const user = React.useMemo(
    () => (!!authenticatedUser ? state.users[authenticatedUser.uid] : null),
    [state.users, authenticatedUser]
  );
  const school = React.useMemo(
    () => (!!authenticatedUser && user ? state.schools[user.school.id] : null),
    [state.schools, authenticatedUser, user]
  );
  const [event, setEvent] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [fetchedEvent] = useFetchEventDetails(props.id);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [
    isDeletingEventAlertOpen,
    setDeletingEventAlertIsOpen
  ] = React.useState(false);
  const [isDeletingEvent, setIsDeletingEvent] = React.useState(false);
  const handleFieldChange = React.useCallback(e => {
    formDispatch({ field: e.target.name, value: e.target.value });
  }, []);
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);
  const toast = useToast();

  // TODO: Tournament feature
  // const [isTournament, setIsTournament] = React.useState("no");

  const onDeletingEventAlertCancel = () => setDeletingEventAlertIsOpen(false);

  const onDeleteEventConfirm = async () => {
    setIsDeletingEvent(true);

    try {
      await firebaseFirestore
        .collection(COLLECTIONS.EVENTS)
        .doc(props.id)
        .delete();

      setDeletingEventAlertIsOpen(false);
      setIsDeletingEvent(false);
      toast({
        title: "Event deleted.",
        description: `Event ${event.name} has been deleted. You will be redirected...`,
        status: "success",
        isClosable: true
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      setDeletingEventAlertIsOpen(false);
      setIsDeletingEvent(false);
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        isClosable: true
      });
    }
  };

  const setLocation = (address, placeId) => {
    formDispatch({ field: "location", value: address });
    formDispatch({ field: "placeId", value: placeId });
  };

  const setGame = value => {
    formDispatch({ field: "game", value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setIsSubmitting(true);

    const { isValid, errors } = validateCreateEvent({
      ...formState,
      startDateTime: DateTime.local(formState.startDateTime),
      endDateTime: DateTime.local(formState.endDateTime)
    });

    setErrors(errors);

    if (!isValid) {
      setIsSubmitting(false);
      window.scrollTo(0, 0);
      return;
    }

    // TODO:
    // Double check the address for a geocode if they blur or something
    // Probably want to save the address and lat/long
    // If we save the placeId, it may be easier to render the map for that place
    geocodeByAddress(formState.location)
      .then(results => {
        console.log({ results });
      })
      .catch(error => {
        console.error({ error });
      });

    const firestoreStartDateTime = firebase.firestore.Timestamp.fromDate(
      formState.startDateTime
    );
    const firestoreEndDateTime = firebase.firestore.Timestamp.fromDate(
      formState.endDateTime
    );
    const schoolDocRef = firebaseFirestore
      .collection(COLLECTIONS.SCHOOLS)
      .doc(user.school.id);
    const userDocRef = firebaseFirestore
      .collection(COLLECTIONS.USERS)
      .doc(user.id);

    const eventData = {
      creator: userDocRef,
      name: formState.name.trim(),
      description: formState.description.trim(),
      isOnlineEvent: formState.isOnlineEvent,
      startDateTime: firestoreStartDateTime,
      endDateTime: firestoreEndDateTime,
      game: formState.game
    };

    if (!formState.isOnlineEvent) {
      eventData.location = formState.location;
      eventData.placeId = formState.placeId;
    }

    if (!props.edit) {
      eventData.school = {
        ref: schoolDocRef,
        id: schoolDocRef.id,
        name: school.name
      };
    }

    if (props.edit) {
      firebaseFirestore
        .collection(COLLECTIONS.EVENTS)
        .doc(props.id)
        .update(eventData)
        .then(() => {
          dispatch({
            type: ACTION_TYPES.SET_EVENT,
            payload: {
              ...event,
              ...eventData
            }
          });

          Object.keys(state.users).forEach(id => {
            const userToUpdate = { ...state.users[id] };

            if (userToUpdate.events) {
              const updatedEvents = userToUpdate.events
                .map(eventResponse =>
                  eventResponse.event.id === props.id
                    ? {
                        ...eventResponse,
                        event: {
                          ...eventResponse.event,
                          ...eventData
                        }
                      }
                    : eventResponse
                )
                .map(mapEventResponse);

              userToUpdate.events = updatedEvents;

              dispatch({
                type: ACTION_TYPES.SET_USER_EVENTS,
                payload: {
                  id,
                  events: updatedEvents
                }
              });

              if (state.user.id === id) {
                dispatch({
                  type: ACTION_TYPES.SET_USER,
                  payload: userToUpdate
                });
              }
            }
          });

          // TODO:
          // Object.keys(state.schools).forEach((id) => {
          //   const schoolToUpdate = {...state.users[id]};

          //   if (schoolToUpdate.events) {
          //     const updatedEvents = schoolToUpdate.events.map((eventResponse) => eventResponse.event.id === props.id ? ({
          //       ...eventResponse,
          //       event: {
          //         ...eventResponse.event,
          //         ...eventData
          //       },
          //     }) : eventResponse).map(mapEvent);

          //     schoolToUpdate.events = updatedEvents;

          //     dispatch({
          //       type: ACTION_TYPES.SET_USER_EVENTS,
          //       payload: {
          //         id,
          //         events: updatedEvents
          //       }
          //     });

          //     if (state.user.id === id) {
          //       dispatch({
          //         type: ACTION_TYPES.SET_USER,
          //         payload: schoolToUpdate
          //       });
          //     }
          //   }
          // });

          toast({
            title: "Event updated.",
            description:
              "Your event has been updated. You will be redirected...",
            status: "success",
            isClosable: true
          });
          setTimeout(() => {
            navigate(`/event/${props.id}`);
          }, 2000);
        })
        .catch(error => {
          setIsSubmitting(false);
          toast({
            title: "An error occurred.",
            description: error.message,
            status: "error",
            isClosable: true
          });
        });
    } else {
      let eventId;

      firebaseFirestore
        .collection(COLLECTIONS.EVENTS)
        .add({
          ...eventData,
          responses: {
            yes: 0,
            no: 0
          }
        })
        .then(eventDocRef => {
          eventId = eventDocRef.id;

          firebaseFirestore
            .collection(COLLECTIONS.EVENTS)
            .doc(eventId)
            .update({ id: eventId })
            .catch(() => {
              setIsSubmitting(false);
            });

          const eventResponseData = {
            response: "YES",
            user: {
              ref: userDocRef,
              id: userDocRef.id,
              firstName: user.firstName,
              lastName: user.lastName,
              gravatar: user.gravatar
            },
            event: {
              ref: eventDocRef,
              id: eventDocRef.id,
              name: formState.name.trim(),
              description: formState.description.trim(),
              startDateTime: firestoreStartDateTime,
              endDateTime: firestoreEndDateTime,
              game: formState.game,
              isOnlineEvent: formState.isOnlineEvent
            },
            school: {
              ref: schoolDocRef,
              id: schoolDocRef.id,
              name: school.name
            }
          };

          firebaseFirestore
            .collection(COLLECTIONS.EVENT_RESPONSES)
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
            description: error.message,
            status: "error",
            isClosable: true
          });
        });
    }
  };

  const getEvent = React.useCallback(() => {
    setEvent(fetchedEvent);
  }, [fetchedEvent]);

  React.useEffect(() => {
    if (props.edit && !event) {
      getEvent();
    }
  }, [props.edit, event, getEvent, fetchedEvent]);

  const prefillForm = () => {
    formDispatch({ field: "name", value: event.name });
    formDispatch({ field: "description", value: event.description });
    formDispatch({ field: "isOnlineEvent", value: event.isOnlineEvent });
    formDispatch({
      field: "startDateTime",
      value: event.startDateTime.toDate()
    });
    formDispatch({ field: "endDateTime", value: event.endDateTime.toDate() });
    formDispatch({ field: "placeId", value: event.location });
    formDispatch({ field: "location", value: event.placeId });
    formDispatch({ field: "game", value: event.game });
    setHasPrefilledForm(true);
  };

  if (!authenticatedUser) {
    return <Redirect to="/" noThrow />;
  }

  if (!user) {
    console.error(`No user found ${props.uri}`);
    return <Redirect to="/not-found" noThrow />;
  }

  if (!hasPrefilledForm && !!event) {
    prefillForm();
  }

  return (
    <React.Fragment>
      <Box as="article" py={16} px={8} mx="auto" fontSize="xl" maxW="5xl">
        {hasErrors ? (
          <Alert status="error" mb={4} rounded="lg">
            <AlertIcon />
            <AlertDescription>
              There are errors in the form below. Please review and correct
              before submitting again.
            </AlertDescription>
          </Alert>
        ) : null}
        <Stack as="form" spacing={32} onSubmit={handleSubmit}>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Heading as="h1" size="2xl">
              {props.edit ? "Edit Event" : "Create an Event"}
            </Heading>
            {props.edit ? (
              <Button
                variant="ghost"
                colorScheme="red"
                size="lg"
                onClick={() => setDeletingEventAlertIsOpen(true)}
              >
                Delete event
              </Button>
            ) : null}
          </Flex>
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
                  Event Creator
                </Text>
                <Flex>
                  {user.gravatar ? (
                    <Avatar
                      name={user.fullName}
                      src={user.gravatarUrl}
                      alt={`The profile picture for ${user.fullName}`}
                      title={`The profile picture for ${user.fullName}`}
                      h={10}
                      w={10}
                      rounded="full"
                    />
                  ) : null}
                  <Text ml={4} as="span" alignSelf="center">
                    {user.fullName}
                  </Text>
                </Flex>
              </Box>
              <FormControl isRequired isInvalid={errors.name}>
                <FormLabel htmlFor="name" fontSize="lg" fontWeight="bold">
                  Event Name
                </FormLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="CSGO and Pizza"
                  maxLength="64"
                  onChange={handleFieldChange}
                  value={formState.name}
                  size="lg"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel
                  htmlFor="onlineEvent"
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Is this an online event?
                </FormLabel>
                <Stack>
                  <Checkbox
                    id="onlineEvent"
                    name="onlineEvent"
                    size="lg"
                    disabled={!!formState.placeId}
                    isChecked={formState.isOnlineEvent}
                    value={formState.isOnlineEvent}
                    onChange={e =>
                      formDispatch({
                        field: "isOnlineEvent",
                        value: e.target.checked
                      })
                    }
                  >
                    Yes, this is an online event
                  </Checkbox>
                </Stack>
              </FormControl>
              <Text>or</Text>
              <FormControl
                isRequired={!formState.isOnlineEvent}
                isInvalid={errors.location}
              >
                <FormLabel htmlFor="location" fontSize="lg" fontWeight="bold">
                  Location
                </FormLabel>
                <Stack>
                  <PlacesAutocomplete
                    value={formState.location}
                    onChange={value => setLocation(value)}
                    onSelect={(address, placeId) =>
                      setLocation(address, placeId)
                    }
                    debounce={600}
                    shouldFetchSuggestions={
                      !!formState.location && formState.location.length >= 3
                    }
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading
                    }) => (
                      <div>
                        <Input
                          {...getInputProps({
                            placeholder: "Add a place or address",
                            className: "location-search-input",
                            disabled: formState.isOnlineEvent
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
                                color="orange.500"
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
                                <Box mr={4}>
                                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </Box>
                                <Text as="span">{suggestion.description}</Text>
                              </div>
                            );
                          })}
                        </Box>
                      </div>
                    )}
                  </PlacesAutocomplete>
                  <FormErrorMessage>{errors.location}</FormErrorMessage>
                </Stack>
              </FormControl>
              <FormControl isInvalid={errors.description}>
                <FormLabel
                  htmlFor="description"
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Description
                </FormLabel>
                <Textarea
                  id="description"
                  name="description"
                  onChange={handleFieldChange}
                  value={formState.description}
                  placeholder="Tell people what your event is about."
                  size="lg"
                  resize="vertical"
                  maxLength="5000"
                  h="150px"
                />
              </FormControl>
              <FormErrorMessage>{errors.description}</FormErrorMessage>
              <FormControl isRequired isInvalid={errors.game}>
                <FormLabel htmlFor="gameSearch" fontSize="lg" fontWeight="bold">
                  Game
                </FormLabel>
                {(props.edit && hasPrefilledForm) || !props.edit ? (
                  <Flex alignItems="center">
                    <Box flexGrow={1}>
                      <GameSearch
                        inputPlaceholder="The game being played"
                        onSelect={setGame}
                        gameName={formState.game ? formState.game.name : ""}
                      />
                    </Box>
                    <Box pl={8}>
                      <GameCover
                        url={
                          formState.game && formState.game.cover
                            ? formState.game.cover.url
                            : null
                        }
                        name={formState.game ? formState.game.name : null}
                        h={20}
                        w={20}
                      />
                    </Box>
                  </Flex>
                ) : null}
                <FormErrorMessage>{errors.game}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.startDateTime}>
                <FormLabel
                  htmlFor="startDateTime"
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Starts
                </FormLabel>
                <FormErrorMessage>{errors.startDateTime}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.endDateTime}>
                <FormLabel
                  htmlFor="endDateTime"
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Ends
                </FormLabel>
                <FormErrorMessage>{errors.endDateTime}</FormErrorMessage>
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
          <Button
            colorScheme="orange"
            type="submit"
            size="lg"
            w="full"
            mt={-12}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : props.edit
              ? "Edit Event"
              : "Create Event"}
          </Button>
        </Stack>
      </Box>

      <AlertDialog
        isOpen={isDeletingEventAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeletingEventAlertCancel}
      >
        <AlertDialogOverlay />
        <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Event
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete the event{" "}
            <Text as="span" fontWeight="bold">
              {event ? event.name : ""}
            </Text>
            ?
          </AlertDialogBody>

          <AlertDialogFooter>
            {isDeletingEvent ? (
              <Button colorScheme="red" disabled={true}>
                Deleting...
              </Button>
            ) : (
              <React.Fragment>
                <Button
                  ref={deleteEventRef}
                  onClick={onDeletingEventAlertCancel}
                >
                  No, nevermind
                </Button>
                <Button colorScheme="red" onClick={onDeleteEventConfirm} ml={3}>
                  Yes, I want to delete the event
                </Button>
              </React.Fragment>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};

export default CreateEvent;
