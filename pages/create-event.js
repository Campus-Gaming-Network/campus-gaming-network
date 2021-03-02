// Libraries
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
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
  Flex,
  Avatar,
  Alert,
  AlertIcon,
  AlertDescription,
  Spacer
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import firebaseAdmin from "src/firebaseAdmin";
import nookies from "nookies";
import safeJsonStringify from "safe-json-stringify";

// Other
import firebase from "src/firebase";

// Components
import SiteLayout from "src/components/SiteLayout";
import GameSearch from "src/components/GameSearch";
import GameCover from "src/components/GameCover";
import MonthSelect from "src/components/MonthSelect";
import DaySelect from "src/components/DaySelect";
import YearSelect from "src/components/YearSelect";
import TimeSelect from "src/components/TimeSelect";

// Hooks
import useFetchEventDetails from "src/hooks/useFetchEventDetails";

// Utilities
import { validateCreateEvent } from "src/utilities/validation";
import { hasToken, getAuthStatus } from "src/utilities/auth";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { CURRENT_YEAR, DASHED_DATE_TIME } from "src/constants/dateTime";
import { AUTH_STATUS } from "src/constants/auth";

const DeleteEventDialog = dynamic(
  () => import("src/components/dialogs/DeleteEventDialog"),
  { ssr: false }
);

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  let cookies;
  let token;
  let authStatus;

  try {
    cookies = nookies.get(context);
    token = hasToken(cookies)
      ? await firebaseAdmin.auth().verifyIdToken(cookies.token)
      : null;
    authStatus = getAuthStatus(token);

    if (authStatus === AUTH_STATUS.UNAUTHENTICATED) {
      return { notFound: true };
    }
  } catch (error) {
    return { notFound: true };
  }

  const { user } = await getUserDetails(token.uid);

  if (!user) {
    return { notFound: true };
  }

  const { school } = await getSchoolDetails(user.school.id);

  const data = {
    user,
    authUser: {
      email: token.email,
      uid: token.uid
    },
    school
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Form Reducer

const initialFormState = {
  name: "",
  description: "",
  game: {},
  startMonth: "",
  startDay: "",
  startYear: "",
  startTime: "",
  endMonth: "",
  endDay: "",
  endYear: "",
  endTime: "",
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
  const router = useRouter();
  const [hasPrefilledForm, setHasPrefilledForm] = React.useState(false);
  const [formState, formDispatch] = React.useReducer(
    formReducer,
    initialFormState
  );
  const [event, setEvent] = React.useState(null);
  const [errors, setErrors] = React.useState({});
  const [fetchedEvent] = useFetchEventDetails(props.id);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [
    isDeletingEventAlertOpen,
    setDeletingEventAlertIsOpen
  ] = React.useState(false);
  const handleFieldChange = React.useCallback(e => {
    formDispatch({ field: e.target.name, value: e.target.value });
  }, []);
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);
  const toast = useToast();

  // TODO: Tournament feature
  // const [isTournament, setIsTournament] = React.useState("no");

  const openDeleteEventDialog = () => {
    setDeletingEventAlertIsOpen(true);
  };

  const closeDeleteEventDialog = () => {
    setDeletingEventAlertIsOpen(false);
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

    let startDateTime = "";
    let endDateTime = "";

    if (
      formState.startMonth &&
      formState.startDay &&
      formState.startYear &&
      formState.startTime
    ) {
      const formattedStartdate = DateTime.fromFormat(
        `${formState.startMonth}-${formState.startDay}-${formState.startYear} ${formState.startTime}`,
        DASHED_DATE_TIME
      );
      startDateTime = firebase.firestore.Timestamp.fromDate(
        new Date(formattedStartdate)
      );
    }

    if (
      formState.endMonth &&
      formState.endDay &&
      formState.endYear &&
      formState.endTime
    ) {
      const formattedEnddate = DateTime.fromFormat(
        `${formState.endMonth}-${formState.endDay}-${formState.endYear} ${formState.endTime}`,
        DASHED_DATE_TIME
      );
      endDateTime = firebase.firestore.Timestamp.fromDate(
        new Date(formattedEnddate)
      );
    }

    const schoolDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.SCHOOLS)
      .doc(props.user.school.id);
    const userDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.USERS)
      .doc(props.user.id);

    const eventData = {
      creator: userDocRef,
      name: formState.name.trim(),
      description: formState.description.trim(),
      isOnlineEvent: formState.isOnlineEvent,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
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
      firebase
        .firestore()
        .collection(COLLECTIONS.EVENTS)
        .doc(props.id)
        .update(eventData)
        .then(() => {
          toast({
            title: "Event updated.",
            description:
              "Your event has been updated. You will be redirected...",
            status: "success",
            isClosable: true
          });
          setTimeout(() => {
            router.push(`/event/${props.id}`);
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

      firebase
        .firestore()
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

          firebase
            .firestore()
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
              firstName: props.user.firstName,
              lastName: props.user.lastName,
              gravatar: props.user.gravatar
            },
            event: {
              ref: eventDocRef,
              id: eventDocRef.id,
              name: formState.name.trim(),
              description: formState.description.trim(),
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              game: formState.game,
              isOnlineEvent: formState.isOnlineEvent
            },
            school: {
              ref: schoolDocRef,
              id: schoolDocRef.id,
              name: school.name
            }
          };

          firebase
            .firestore()
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
                router.push(`/event/${eventId}`);
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

    const [startDate, startTime] = DateTime.fromISO(
      event.startDateTime.toDate().toISOString()
    )
      .toFormat(DASHED_DATE_TIME)
      .split(" ");
    const [startMonth, startDay, startYear] = startDate.split("-");

    formDispatch({ field: "startMonth", value: startMonth });
    formDispatch({ field: "startDay", value: startDay });
    formDispatch({ field: "startYear", value: startYear });
    formDispatch({ field: "startTime", value: startTime });

    const [endDate, endTime] = DateTime.fromISO(
      event.endDateTime.toDate().toISOString()
    )
      .toFormat(DASHED_DATE_TIME)
      .split(" ");
    const [endMonth, endDay, endYear] = endDate.split("-");

    formDispatch({ field: "endMonth", value: endMonth });
    formDispatch({ field: "endDay", value: endDay });
    formDispatch({ field: "endYear", value: endYear });
    formDispatch({ field: "endTime", value: endTime });

    formDispatch({ field: "placeId", value: event.location });
    formDispatch({ field: "location", value: event.placeId });
    formDispatch({ field: "game", value: event.game });
    setHasPrefilledForm(true);
  };

  if (!hasPrefilledForm) {
    prefillForm();
  }

  return (
    <SiteLayout title="Create Event">
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
          <Flex alignItems="center" flexWrap="wrap">
            <Heading as="h2" size="2xl">
              {props.edit ? "Edit Event" : "Create an Event"}
            </Heading>
            <Spacer />
            {props.edit ? (
              <Button
                variant="ghost"
                colorScheme="red"
                size="lg"
                onClick={openDeleteEventDialog}
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
                  {props.user.gravatar ? (
                    <Avatar
                      name={props.user.fullName}
                      src={props.user.gravatarUrl}
                      size="sm"
                    />
                  ) : null}
                  <Text ml={4} as="span" alignSelf="center">
                    {props.user.fullName}
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
                    disabled={Boolean(formState.placeId)}
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
                    shouldFetchSuggestions={Boolean(
                      formState.location && formState.location.length >= 3
                    )}
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
                                color="brand.500"
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
              <Box as="fieldset">
                <Text as="legend" fontSize="lg" fontWeight="bold">
                  Start Date and Time
                </Text>
                <Stack spacing={4}>
                  <Flex flexWrap="wrap">
                    <FormControl
                      isRequired
                      isInvalid={errors.startDay}
                      flexBasis={{ md: "20%", sm: "100%" }}
                      pr={{ md: 4, sm: 0 }}
                    >
                      <FormLabel
                        htmlFor="startDay"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        Day
                      </FormLabel>
                      <DaySelect
                        id="startDay"
                        name="startDay"
                        onChange={handleFieldChange}
                        value={formState.startDay}
                        size="lg"
                      />
                      <FormErrorMessage>{errors.startDay}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={errors.startMonth}
                      flexBasis={{ md: "25%", sm: "100%" }}
                      pr={{ md: 4, sm: 0 }}
                    >
                      <FormLabel
                        htmlFor="startMonth"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        Month
                      </FormLabel>
                      <MonthSelect
                        id="startMonth"
                        name="startMonth"
                        onChange={handleFieldChange}
                        value={formState.startMonth}
                        size="lg"
                      />
                      <FormErrorMessage>{errors.startMonth}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={errors.startYear}
                      flexBasis={{ md: "25%", sm: "100%" }}
                    >
                      <FormLabel
                        htmlFor="startYear"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        Year
                      </FormLabel>
                      <YearSelect
                        id="startYear"
                        name="startYear"
                        onChange={handleFieldChange}
                        value={formState.startYear}
                        size="lg"
                        min={CURRENT_YEAR}
                        max={CURRENT_YEAR + 5}
                      />
                      <FormErrorMessage>{errors.startYear}</FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex>
                    <FormControl
                      isRequired
                      isInvalid={errors.startTime}
                      flexBasis={{ md: "33.3333%", sm: "100%" }}
                    >
                      <FormLabel
                        htmlFor="startTime"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        Start Time
                      </FormLabel>
                      <TimeSelect
                        id="startTime"
                        name="startTime"
                        onChange={handleFieldChange}
                        value={formState.startTime}
                        size="lg"
                      />
                      <FormErrorMessage>{errors.startTime}</FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Stack>
                <Text color="red.500" fontSize="sm">
                  {errors.startDateTime}
                </Text>
              </Box>
              <Box as="fieldset">
                <Text as="legend" fontSize="lg" fontWeight="bold">
                  End Date and Time
                </Text>
                <Stack spacing={4}>
                  <Flex flexWrap="wrap">
                    <FormControl
                      isRequired
                      isInvalid={errors.endDay}
                      flexBasis={{ md: "20%", sm: "100%" }}
                      pr={{ md: 4, sm: 0 }}
                    >
                      <FormLabel
                        htmlFor="endDay"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        Day
                      </FormLabel>
                      <DaySelect
                        id="endDay"
                        name="endDay"
                        onChange={handleFieldChange}
                        value={formState.endDay}
                        size="lg"
                      />
                      <FormErrorMessage>{errors.endDay}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={errors.endMonth}
                      flexBasis={{ md: "25%", sm: "100%" }}
                      pr={{ md: 4, sm: 0 }}
                    >
                      <FormLabel
                        htmlFor="endMonth"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        Month
                      </FormLabel>
                      <MonthSelect
                        id="endMonth"
                        name="endMonth"
                        onChange={handleFieldChange}
                        value={formState.endMonth}
                        size="lg"
                      />
                      <FormErrorMessage>{errors.endMonth}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={errors.endYear}
                      flexBasis={{ md: "25%", sm: "100%" }}
                      pr={{ md: 4, sm: 0 }}
                    >
                      <FormLabel
                        htmlFor="endYear"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        Year
                      </FormLabel>
                      <YearSelect
                        id="endYear"
                        name="endYear"
                        onChange={handleFieldChange}
                        value={formState.endYear}
                        size="lg"
                        min={CURRENT_YEAR}
                        max={CURRENT_YEAR + 5}
                      />
                      <FormErrorMessage>{errors.endYear}</FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex>
                    <FormControl
                      isRequired
                      isInvalid={errors.endTime}
                      flexBasis={{ md: "33.3333%", sm: "100%" }}
                    >
                      <FormLabel
                        htmlFor="endTime"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        End Time
                      </FormLabel>
                      <TimeSelect
                        id="endTime"
                        name="endTime"
                        onChange={handleFieldChange}
                        value={formState.endTime}
                        size="lg"
                      />
                      <FormErrorMessage>{errors.endTime}</FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Stack>
                <Text color="red.500" fontSize="sm">
                  {errors.endDateTime}
                </Text>
              </Box>
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
            colorScheme="brand"
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

      <DeleteEventDialog
        event={event}
        isOpen={isDeletingEventAlertOpen}
        onClose={closeDeleteEventDialog}
      />
    </SiteLayout>
  );
};

export default CreateEvent;
