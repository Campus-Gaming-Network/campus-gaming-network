import React from "react";
import { Redirect, navigate } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import xorBy from "lodash.xorby";
import omitBy from "lodash.omitby";
import isNil from "lodash.isnil";
import isEmpty from "lodash.isempty";
import startCase from "lodash.startcase";
import moment from "moment";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Select,
  Button,
  Textarea,
  Heading,
  Text,
  Tooltip,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  FormErrorMessage,
  useToast
} from "@chakra-ui/core";
import * as constants from "../constants";
import { firebase, firebaseFirestore, firebaseAuth } from "../firebase";
import timezones from "../data/timezones.json";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAppState, useAppDispatch, ACTION_TYPES } from "../store";
import SchoolSearch from "../components/SchoolSearch";
import GameSearch from "../components/GameSearch";
import GameCover from "../components/GameCover";
import { mapUser, move } from "../utilities";
import { validateEditUser } from "../utilities/validation";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";

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
  birthMonth: "",
  birthDay: "",
  birthYear: "",
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
  const cancelRef = React.useRef();
  const deleteAccountRef = React.useRef();
  const [authenticatedUser] = useAuthState(firebaseAuth);
  const user = authenticatedUser ? state.users[authenticatedUser.uid] : null;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasPrefilledForm, setHasPrefilledForm] = React.useState(false);
  const [
    isDeletingAccountAlertOpen,
    setDeletingAccountAlertIsOpen
  ] = React.useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);
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
  const schoolName = React.useMemo(
    () => startCase(state.schools[user.school.id].name.toLowerCase()),
    [user.school.id, state.schools]
  );
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

  const onDeletingAccountAlertCancel = () =>
    setDeletingAccountAlertIsOpen(false);

  const onDeleteAccountConfirm = async () => {
    setIsDeletingAccount(true);

    try {
      await firebaseFirestore
        .collection("users")
        .doc(user.id)
        .delete();

      setDeletingAccountAlertIsOpen(false);
      setIsDeletingAccount(false);
      toast({
        title: "Account deleted.",
        description: "Your account has been deleted. You will be redirected...",
        status: "success",
        isClosable: true
      });
      setTimeout(() => {
        firebaseAuth.signOut().then(() => navigate("/"));
      }, 2000);
    } catch (error) {
      console.error(error);
      setDeletingAccountAlertIsOpen(false);
      setIsDeletingAccount(false);
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        isClosable: true
      });
    }
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

    if (user.birthdate) {
      const [birthMonth, birthDay, birthYear] = moment(user.birthdate.toDate())
        .format("MMMM-DD-YYYY")
        .split("-");
      formDispatch({ field: "birthMonth", value: birthMonth });
      formDispatch({ field: "birthDay", value: birthDay });
      formDispatch({ field: "birthYear", value: birthYear });
    } else {
      formDispatch({ field: "birthMonth", value: "" });
      formDispatch({ field: "birthDay", value: "" });
      formDispatch({ field: "birthYear", value: "" });
    }

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

  const onSchoolSelect = school => {
    formDispatch({ field: "school", value: school.id || "" });
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

  const reorderCurrentlyPlaying = (from, to) => {
    setCurrentGames(move(currentlyPlaying, from, to));
  };

  const reorderFavoriteGames = (from, to) => {
    setFavoriteGames(move(favoriteGames, from, to));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!authenticatedUser) {
      return;
    }

    setIsSubmitting(true);

    const { isValid, errors } = validateEditUser({
      ...formState,
      currentlyPlaying,
      favoriteGames
    });

    setErrors(errors);

    if (!isValid) {
      setIsSubmitting(false);
      window.scrollTo(0, 0);
      return;
    }

    const schoolDocRef = firebaseFirestore
      .collection("schools")
      .doc(formState.school);

    let birthdate = null;

    if (formState.birthMonth && formState.birthDay && formState.birthYear) {
      const momentBirthdate = moment(
        `${formState.birthMonth}-${formState.birthDay}-${formState.birthYear}`,
        "MMMM-DD-YYYY"
      );
      birthdate = firebase.firestore.Timestamp.fromDate(
        new Date(momentBirthdate)
      );
    }

    const data = {
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      status: formState.status,
      hometown: formState.hometown.trim(),
      birthdate: birthdate,
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
      school: {
        ref: schoolDocRef,
        id: schoolDocRef.id
      },
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

        const schoolToUpdate = { ...state.schools[user.school.id] };

        if (schoolToUpdate.users) {
          Object.keys(schoolToUpdate.users).forEach(page => {
            const updatedUsers = schoolToUpdate.users[page]
              .map(_user => ({
                ..._user,
                firstName:
                  _user.id === user.id
                    ? cleanedData.firstName
                    : _user.firstName,
                lastName:
                  _user.id === user.id ? cleanedData.lastName : _user.lastName
              }))
              .map(mapUser);

            schoolToUpdate.users[page] = updatedUsers;

            dispatch({
              type: ACTION_TYPES.SET_SCHOOL_USERS,
              payload: {
                id: user.school.id,
                users: updatedUsers,
                page
              }
            });
          });

          if (state.school.id === user.school.id) {
            dispatch({
              type: ACTION_TYPES.SET_SCHOOL,
              payload: schoolToUpdate
            });
          }
        }

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
          description: error.message,
          status: "error",
          isClosable: true
        });
      });
  };

  if (!authenticatedUser) {
    return <Redirect to="/" noThrow />;
  }

  if (!user) {
    console.error(`No user found ${props.uri}`);
    return <Redirect to="/not-found" noThrow />;
  }

  if (!hasPrefilledForm) {
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
            justifyContent={{ md: "space-between", sm: "center", xs: "center" }}
            alignItems="center"
            flexWrap="wrap"
          >
            <Heading as="h1" size="2xl" pb={{ md: 0, sm: 6, xs: 6 }}>
              Your Profile
            </Heading>
            <Button
              variant="ghost"
              variantColor="red"
              size="lg"
              onClick={() => setDeletingAccountAlertIsOpen(true)}
            >
              Delete account
            </Button>
          </Flex>
          <Button
            variantColor="purple"
            type="submit"
            size="lg"
            w="full"
            mt={-12}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Update Profile"}
          </Button>
          <DetailSection
            handleFieldChange={handleFieldChange}
            errors={errors}
            firstName={formState.firstName}
            lastName={formState.lastName}
            email={authenticatedUser.email}
            hometown={formState.hometown}
            birthYear={formState.birthYear}
            birthMonth={formState.birthMonth}
            birthDay={formState.birthDay}
            bio={formState.bio}
            timezone={formState.timezone}
          />
          <SchoolSection
            handleFieldChange={handleFieldChange}
            errors={errors}
            onSchoolSelect={onSchoolSelect}
            schoolName={schoolName}
            status={formState.status}
            major={formState.major}
            minor={formState.minor}
          />
          <SocialAccountsSection
            handleFieldChange={handleFieldChange}
            errors={errors}
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
            errors={errors}
            toggleFavoriteGame={toggleFavoriteGame}
            favoriteGames={favoriteGames}
            onGameSelect={onFavoriteGameSelect}
            reorderFavoriteGames={reorderFavoriteGames}
          />
          <CurrentlyPlayingSection
            handleFieldChange={handleFieldChange}
            errors={errors}
            toggleCurrentGame={toggleCurrentGame}
            currentlyPlaying={currentlyPlaying}
            onGameSelect={onCurrentlyPlayingGameSelect}
            reorderCurrentlyPlaying={reorderCurrentlyPlaying}
          />
          <Button
            variantColor="purple"
            type="submit"
            size="lg"
            w="full"
            mt={-12}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Update Profile"}
          </Button>
        </Stack>
      </Box>

      <AlertDialog
        isOpen={isDeletingAccountAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeletingAccountAlertCancel}
      >
        <AlertDialogOverlay />
        <AlertDialogContent rounded="lg" borderWidth="1px" boxShadow="lg">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Account
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete your account and all related data?
            There is no coming back from this.
          </AlertDialogBody>

          <AlertDialogFooter>
            {isDeletingAccount ? (
              <Button variantColor="red" disabled={true}>
                Deleting...
              </Button>
            ) : (
              <React.Fragment>
                <Button
                  ref={deleteAccountRef}
                  onClick={onDeletingAccountAlertCancel}
                >
                  No, nevermind
                </Button>
                <Button
                  variantColor="red"
                  onClick={onDeleteAccountConfirm}
                  ml={3}
                >
                  Yes, delete my account.
                </Button>
              </React.Fragment>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};

const DetailSection = React.memo(props => {
  // TODO: Make a constant for 2500
  const bioCharactersRemaining = props.bio ? 2500 - props.bio.length : 2500;

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
        <Flex flexWrap="wrap">
          <FormControl
            isRequired
            isInvalid={props.errors.firstName}
            flexBasis={{ md: "50%", sm: "100%", xs: "100%" }}
            pr={{ md: 4, sm: 0, xs: 0 }}
          >
            <FormLabel htmlFor="firstName" fontSize="lg" fontWeight="bold">
              First Name
            </FormLabel>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Brandon"
              onChange={props.handleFieldChange}
              value={props.firstName}
              size="lg"
            />
            <FormErrorMessage>{props.errors.firstName}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={props.errors.lastName}
            flexBasis={{ md: "50%", sm: "100%", xs: "100%" }}
            pt={{ md: 0, sm: 6, xs: 6 }}
          >
            <FormLabel htmlFor="lastName" fontSize="lg" fontWeight="bold">
              Last Name
            </FormLabel>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Sansone"
              onChange={props.handleFieldChange}
              value={props.lastName}
              roundedLeft="0"
              size="lg"
            />
            <FormErrorMessage>{props.errors.lastName}</FormErrorMessage>
          </FormControl>
        </Flex>
        <FormControl
          disabled
          width={{ md: "50%", sm: "100%", xs: "100%" }}
          pr={{ md: 4, sm: 0, xs: 0 }}
        >
          <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
            Email
          </FormLabel>
          <Input
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
        <FormControl
          isInvalid={props.errors.hometown}
          width={{ md: "50%", sm: "100%", xs: "100%" }}
          pr={{ md: 4, sm: 0, xs: 0 }}
        >
          <FormLabel htmlFor="hometown" fontSize="lg" fontWeight="bold">
            Hometown
          </FormLabel>
          <Input
            id="hometown"
            name="hometown"
            type="text"
            placeholder="Chicago, IL"
            onChange={props.handleFieldChange}
            value={props.hometown}
            size="lg"
          />
          <FormErrorMessage>{props.errors.hometown}</FormErrorMessage>
        </FormControl>
        <Box as="fieldset">
          <Text as="legend" fontSize="lg" fontWeight="bold">
            Birthday
          </Text>
          <Flex flexWrap="wrap">
            <FormControl
              isInvalid={props.errors.birthMonth}
              flexBasis={{ md: "33.3333%", sm: "100%", xs: "100%" }}
              pr={{ md: 4, sm: 0, xs: 0 }}
            >
              <FormLabel htmlFor="birthMonth" fontSize="sm" fontWeight="bold">
                Month
              </FormLabel>
              <Select
                id="birthMonth"
                name="birthMonth"
                onChange={props.handleFieldChange}
                value={props.birthMonth}
                size="lg"
              >
                <option value="">Select month</option>
                {constants.MONTHS.map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{props.errors.birthMonth}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={props.errors.birthDay}
              flexBasis={{ md: "33.3333%", sm: "100%", xs: "100%" }}
              pr={{ md: 4, sm: 0, xs: 0 }}
            >
              <FormLabel htmlFor="birthDay" fontSize="sm" fontWeight="bold">
                Day
              </FormLabel>
              <Select
                id="birthDay"
                name="birthDay"
                onChange={props.handleFieldChange}
                value={props.birthDay}
                size="lg"
              >
                <option value="">Select day</option>
                {constants.DAYS.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{props.errors.birthDay}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={props.errors.birthYear}
              flexBasis={{ md: "33.3333%", sm: "100%", xs: "100%" }}
            >
              <FormLabel htmlFor="birthYear" fontSize="sm" fontWeight="bold">
                Year
              </FormLabel>
              <Select
                id="birthYear"
                name="birthYear"
                onChange={props.handleFieldChange}
                value={props.birthYear}
                size="lg"
              >
                <option value="">Select year</option>
                {constants.YEARS.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{props.errors.birthYear}</FormErrorMessage>
            </FormControl>
          </Flex>
          <Text color="red.500" fontSize="sm">
            {props.errors.birthdate}
          </Text>
        </Box>
        <FormControl isInvalid={props.errors.bio}>
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
            maxLength="2500"
            h="150px"
          />
          <FormHelperText id="bio-helper-text">
            Describe yourself in fewer than 2,500 characters.{" "}
            <Text
              as="span"
              color={bioCharactersRemaining <= 0 ? "red.500" : undefined}
            >
              {bioCharactersRemaining.toLocaleString()} characters remaining.
            </Text>
          </FormHelperText>
          <FormErrorMessage>{props.errors.bio}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={props.errors.timezone}
          width={{ md: "50%", sm: "100%", xs: "100%" }}
          pr={{ md: 4, sm: 0, xs: 0 }}
        >
          <FormLabel htmlFor="timezone" fontSize="lg" fontWeight="bold">
            Timezone
          </FormLabel>
          <Select
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
          </Select>
          <FormHelperText id="timezone-helper-text">
            For displaying dates and times correctly.
          </FormHelperText>
          <FormErrorMessage>{props.errors.timezone}</FormErrorMessage>
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
        <FormControl isRequired isInvalid={props.errors.school}>
          <FormLabel htmlFor="school" fontSize="lg" fontWeight="bold">
            School
          </FormLabel>
          <SchoolSearch
            onSelect={props.onSchoolSelect}
            schoolName={props.schoolName}
          />
          <FormErrorMessage>{props.errors.school}</FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          isInvalid={props.errors.status}
          width={{ md: "50%", sm: "100%", xs: "100%" }}
          pr={{ md: 4, sm: 0, xs: 0 }}
        >
          <FormLabel htmlFor="status" fontSize="lg" fontWeight="bold">
            Status
          </FormLabel>
          <Select
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
          </Select>
          <FormErrorMessage>{props.errors.status}</FormErrorMessage>
        </FormControl>
        <Flex flexWrap="wrap">
          <FormControl
            isInvalid={props.errors.major}
            flexBasis={{ md: "50%", sm: "100%", xs: "100%" }}
            pr={{ md: 4, sm: 0 }}
          >
            <FormLabel htmlFor="major" fontSize="lg" fontWeight="bold">
              Major
            </FormLabel>
            <Input
              id="major"
              name="major"
              type="text"
              onChange={props.handleFieldChange}
              value={props.major}
              size="lg"
            />
            <FormErrorMessage>{props.errors.major}</FormErrorMessage>
          </FormControl>
          <FormControl
            isInvalid={props.errors.minor}
            flexBasis={{ md: "50%", sm: "100%", xs: "100%" }}
            pt={{ md: 0, sm: 6, xs: 6 }}
          >
            <FormLabel htmlFor="minor" fontSize="lg" fontWeight="bold">
              Minor
            </FormLabel>
            <Input
              id="minor"
              name="minor"
              type="text"
              onChange={props.handleFieldChange}
              value={props.minor}
              size="lg"
            />
            <FormErrorMessage>{props.errors.minor}</FormErrorMessage>
          </FormControl>
        </Flex>
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
            <FormControl key={id} isInvalid={props.errors[id]}>
              <FormLabel htmlFor={id} fontSize="lg" fontWeight="bold">
                {account.label}
              </FormLabel>
              <InputGroup size="lg">
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
                <Input
                  id={id}
                  name={id}
                  type="text"
                  placeholder={account.placeholder}
                  onChange={props.handleFieldChange}
                  value={props[id]}
                  roundedLeft="0"
                />
              </InputGroup>
              <FormErrorMessage>{props.errors[id]}</FormErrorMessage>
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
        <FormControl isInvalid={props.errors.favoriteGames}>
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
        <FormErrorMessage>{props.errors.favoriteGames}</FormErrorMessage>
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
              {props.favoriteGames.map((game, index) => {
                const nextGame = props.favoriteGames[index + 1];
                const isLast = index === props.favoriteGames.length - 1;

                return (
                  <Box key={game.id} w="125px" mt={4}>
                    <Flex alignItems="center" justifyContent="space-between">
                      <GameCover
                        url={game.cover ? game.cover.url : null}
                        name={game.name}
                      />
                      {!isLast ? (
                        <Stack px={2}>
                          <Tooltip
                            label={`Move ${game.name} to spot #${index + 2}`}
                          >
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() =>
                                props.reorderFavoriteGames(index, index + 1)
                              }
                            >
                              <FontAwesomeIcon icon={faCaretRight} />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            label={`Move ${nextGame.name} to spot #${index +
                              1}`}
                          >
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() =>
                                props.reorderFavoriteGames(index + 1, index)
                              }
                            >
                              <FontAwesomeIcon icon={faCaretLeft} />
                            </Button>
                          </Tooltip>
                        </Stack>
                      ) : null}
                    </Flex>
                    <Text
                      fontSize="sm"
                      lineHeight="1.2"
                      pr={2}
                      py={2}
                      isTruncated
                      title={game.name}
                    >
                      {game.name}
                    </Text>
                    <Tooltip
                      label={`Remove ${game.name} from favorite games list`}
                    >
                      <Button
                        size="xs"
                        variant="ghost"
                        variantColor="red"
                        onClick={() => props.toggleFavoriteGame(game)}
                      >
                        Remove
                      </Button>
                    </Tooltip>
                  </Box>
                );
              })}
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
        <FormControl isInvalid={props.errors.favoriteGames}>
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
          <FormErrorMessage>{props.errors.favoriteGames}</FormErrorMessage>
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
            <Stack isInline>
              {props.currentlyPlaying.map((game, index) => {
                const nextGame = props.currentlyPlaying[index + 1];
                const isLast = index === props.currentlyPlaying.length - 1;

                return (
                  <Box key={game.id} w="125px" mt={4}>
                    <Flex alignItems="center" justifyContent="space-between">
                      <GameCover
                        url={game.cover ? game.cover.url : null}
                        name={game.name}
                      />
                      {!isLast ? (
                        <Stack px={2}>
                          <Tooltip
                            label={`Move ${game.name} to spot #${index + 2}`}
                          >
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() =>
                                props.reorderCurrentlyPlaying(index, index + 1)
                              }
                            >
                              <FontAwesomeIcon icon={faCaretRight} />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            label={`Move ${nextGame.name} to spot #${index +
                              1}`}
                          >
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() =>
                                props.reorderCurrentlyPlaying(index + 1, index)
                              }
                            >
                              <FontAwesomeIcon icon={faCaretLeft} />
                            </Button>
                          </Tooltip>
                        </Stack>
                      ) : null}
                    </Flex>
                    <Text
                      fontSize="sm"
                      lineHeight="1.2"
                      pr={2}
                      py={2}
                      isTruncated
                      title={game.name}
                    >
                      {game.name}
                    </Text>
                    <Tooltip
                      label={`Remove ${game.name} from currently playing list`}
                    >
                      <Button
                        size="xs"
                        variant="ghost"
                        variantColor="red"
                        onClick={() => props.toggleCurrentGame(game)}
                      >
                        Remove
                      </Button>
                    </Tooltip>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
});

export default EditUser;
