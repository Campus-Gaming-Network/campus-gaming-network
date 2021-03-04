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
  Flex,
  Avatar,
  Alert,
  AlertIcon,
  AlertDescription,
  Spacer
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import PlacesAutocomplete from "react-places-autocomplete";
import { DateTime } from "luxon";

// Components
import SiteLayout from "src/components/SiteLayout";
import FormSilhouette from "src/components/silhouettes/FormSilhouette";
import GameSearch from "src/components/GameSearch";
import GameCover from "src/components/GameCover";
import MonthSelect from "src/components/MonthSelect";
import DaySelect from "src/components/DaySelect";
import YearSelect from "src/components/YearSelect";
import TimeSelect from "src/components/TimeSelect";

// Constants
import { CURRENT_YEAR, DASHED_DATE_TIME } from "src/constants/dateTime";

import { useAuth } from "src/providers/auth";

const DeleteEventDialog = dynamic(
  () => import("src/components/dialogs/DeleteEventDialog"),
  { ssr: false }
);

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
// EventForm

const EventForm = props => {
  const { authStatus, user } = useAuth();
  const [hasPrefilledForm, setHasPrefilledForm] = React.useState(false);
  const [formState, formDispatch] = React.useReducer(
    formReducer,
    initialFormState
  );
  const [
    isDeletingEventAlertOpen,
    setDeletingEventAlertIsOpen
  ] = React.useState(false);
  const handleFieldChange = React.useCallback(e => {
    formDispatch({ field: e.target.name, value: e.target.value });
  }, []);
  const hasErrors = React.useMemo(() => !isEmpty(props.errors), [props.errors]);
  const pageTitle = React.useMemo(
    () =>
      props.state === "edit" ? `Edit ${props.event.name}` : "Create Event",
    [props.state, props.event]
  );

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

  const handleSubmit = e => {
    // e.preventDefault();

    // setIsSubmitting(true);

    // const { isValid, errors } = validateCreateEvent({
    //   ...formState,
    //   startDateTime: DateTime.local(formState.startDateTime),
    //   endDateTime: DateTime.local(formState.endDateTime)
    // });

    // setErrors(errors);

    // if (!isValid) {
    //   setIsSubmitting(false);
    //   window.scrollTo(0, 0);
    //   return;
    // }

    props.onSubmit(e, formState);
  };

  const prefillForm = () => {
    formDispatch({ field: "name", value: props.event.name });
    formDispatch({ field: "description", value: props.event.description });
    formDispatch({ field: "isOnlineEvent", value: props.event.isOnlineEvent });

    const [startDate, startTime] = DateTime.fromISO(
      props.event.startDateTime.toDate().toISOString()
    )
      .toFormat(DASHED_DATE_TIME)
      .split(" ");
    const [startMonth, startDay, startYear] = startDate.split("-");

    formDispatch({ field: "startMonth", value: startMonth });
    formDispatch({ field: "startDay", value: startDay });
    formDispatch({ field: "startYear", value: startYear });
    formDispatch({ field: "startTime", value: startTime });

    const [endDate, endTime] = DateTime.fromISO(
      props.event.endDateTime.toDate().toISOString()
    )
      .toFormat(DASHED_DATE_TIME)
      .split(" ");
    const [endMonth, endDay, endYear] = endDate.split("-");

    formDispatch({ field: "endMonth", value: endMonth });
    formDispatch({ field: "endDay", value: endDay });
    formDispatch({ field: "endYear", value: endYear });
    formDispatch({ field: "endTime", value: endTime });

    formDispatch({ field: "placeId", value: props.event.location });
    formDispatch({ field: "location", value: props.event.placeId });
    formDispatch({ field: "game", value: props.event.game });
    setHasPrefilledForm(true);
  };

  if (authStatus !== "finished") {
    return (
      <SiteLayout title={pageTitle}>
        <FormSilhouette />
      </SiteLayout>
    );
  }

  if (props.state === "edit" && !hasPrefilledForm) {
    prefillForm();
  }

  return (
    <SiteLayout title={pageTitle}>
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
              {props.state === "edit" ? "Edit Event" : "Create an Event"}
            </Heading>
            <Spacer />
            {props.state === "edit" ? (
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
                  {user.gravatar ? (
                    <Avatar
                      name={user.fullName}
                      src={user.gravatarUrl}
                      size="sm"
                    />
                  ) : null}
                  <Text ml={4} as="span" alignSelf="center">
                    {user.fullName}
                  </Text>
                </Flex>
              </Box>
              <FormControl isRequired isInvalid={props.errors.name}>
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
                <FormErrorMessage>{props.errors.name}</FormErrorMessage>
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
                isInvalid={props.errors.location}
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
                  <FormErrorMessage>{props.errors.location}</FormErrorMessage>
                </Stack>
              </FormControl>
              <FormControl isInvalid={props.errors.description}>
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
              <FormErrorMessage>{props.errors.description}</FormErrorMessage>
              <FormControl isRequired isInvalid={props.errors.game}>
                <FormLabel htmlFor="gameSearch" fontSize="lg" fontWeight="bold">
                  Game
                </FormLabel>
                {(props.state === "edit" && hasPrefilledForm) ||
                props.state !== "edit" ? (
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
                <FormErrorMessage>{props.errors.game}</FormErrorMessage>
              </FormControl>
              <Box as="fieldset">
                <Text as="legend" fontSize="lg" fontWeight="bold">
                  Start Date and Time
                </Text>
                <Stack spacing={4}>
                  <Flex flexWrap="wrap">
                    <FormControl
                      isRequired
                      isInvalid={props.errors.startDay}
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
                      <FormErrorMessage>
                        {props.errors.startDay}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={props.errors.startMonth}
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
                      <FormErrorMessage>
                        {props.errors.startMonth}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={props.errors.startYear}
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
                      <FormErrorMessage>
                        {props.errors.startYear}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex>
                    <FormControl
                      isRequired
                      isInvalid={props.errors.startTime}
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
                      <FormErrorMessage>
                        {props.errors.startTime}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Stack>
                <Text color="red.500" fontSize="sm">
                  {props.errors.startDateTime}
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
                      isInvalid={props.errors.endDay}
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
                      <FormErrorMessage>{props.errors.endDay}</FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={props.errors.endMonth}
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
                      <FormErrorMessage>
                        {props.errors.endMonth}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={props.errors.endYear}
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
                      <FormErrorMessage>
                        {props.errors.endYear}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                  <Flex>
                    <FormControl
                      isRequired
                      isInvalid={props.errors.endTime}
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
                      <FormErrorMessage>
                        {props.errors.endTime}
                      </FormErrorMessage>
                    </FormControl>
                  </Flex>
                </Stack>
                <Text color="red.500" fontSize="sm">
                  {props.errors.endDateTime}
                </Text>
              </Box>
            </Stack>
          </Box>
          <Button
            colorScheme="brand"
            type="submit"
            size="lg"
            w="full"
            mt={-12}
            disabled={props.isSubmitting}
          >
            {props.isSubmitting
              ? "Submitting..."
              : props.state === "edit"
              ? "Edit Event"
              : "Create Event"}
          </Button>
        </Stack>
      </Box>

      {props.state === "edit" ? (
        <DeleteEventDialog
          event={props.event}
          isOpen={isDeletingEventAlertOpen}
          onClose={closeDeleteEventDialog}
        />
      ) : null}
    </SiteLayout>
  );
};

export default EventForm;
