// Libraries
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import xorBy from "lodash.xorby";
import isEmpty from "lodash.isempty";
import { DateTime } from "luxon";
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
  FormErrorMessage,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spacer
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import * as firebaseAdmin from "firebase-admin";
import nookies from "nookies";
import safeJsonStringify from "safe-json-stringify";

// Constants
import {
  STUDENT_STATUS_OPTIONS,
  MAX_BIO_LENGTH,
  MAX_FAVORITE_GAME_LIST,
  MAX_CURRENTLY_PLAYING_LIST
} from "src/constants/user";
import { TIMEZONES, DASHED_DATE, CURRENT_YEAR } from "src/constants/dateTime";
import { COLLECTIONS } from "src/constants/firebase";
import { ACCOUNTS } from "src/constants/other";
import { AUTH_STATUS } from "src/constants/auth";

// Other
import { firebase } from "src/firebase";
import { getUserDetails } from "src/api/user";
import { getSchoolDetails } from "src/api/school";

// Components
import SchoolSearch from "src/components/SchoolSearch";
import GameSearch from "src/components/GameSearch";
import GameCover from "src/components/GameCover";
import MonthSelect from "src/components/MonthSelect";
import DaySelect from "src/components/DaySelect";
import YearSelect from "src/components/YearSelect";
import DeleteAccountDialog from "src/components/dialogs/DeleteAccountDialog";

// Utilities
import { mapUser } from "src/utilities/user";
import { move } from "src/utilities/other";
import { validateEditUser } from "src/utilities/validation";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async context => {
  let cookies;
  let token;
  let authStatus;

  try {
    cookies = nookies.get(context);
    token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    authStatus = Boolean(token.uid)
      ? AUTH_STATUS.AUTHENTICATED
      : AUTH_STATUS.UNAUTHENTICATED;

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

////////////////////////////////////////////////////////////////////////////////
// EditUser

const EditUser = props => {
  console.log({ props });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hasPrefilledForm, setHasPrefilledForm] = React.useState(false);
  const [
    isDeletingAccountAlertOpen,
    setDeletingAccountAlertIsOpen
  ] = React.useState(false);
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
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

  const openDeleteAccountDialog = () => {
    setDeletingAccountAlertIsOpen(true);
  };

  const closeDeleteAccountDialog = () => {
    setDeletingAccountAlertIsOpen(false);
  };

  const prefillForm = () => {
    formDispatch({
      field: "firstName",
      value: props.user.firstName || initialFormState.firstName
    });
    formDispatch({
      field: "lastName",
      value: props.user.lastName || initialFormState.lastName
    });
    formDispatch({
      field: "school",
      value: props.user.school.id || initialFormState.school
    });
    formDispatch({
      field: "status",
      value: props.user.status || initialFormState.status
    });
    formDispatch({
      field: "major",
      value: props.user.major || initialFormState.major
    });
    formDispatch({
      field: "minor",
      value: props.user.minor || initialFormState.minor
    });
    formDispatch({
      field: "bio",
      value: props.user.bio || initialFormState.bio
    });
    formDispatch({
      field: "timezone",
      value: props.user.timezone || initialFormState.timezone
    });
    formDispatch({
      field: "hometown",
      value: props.user.hometown || initialFormState.hometown
    });

    if (props.user.birthdate) {
      const [birthMonth, birthDay, birthYear] = DateTime.fromISO(
        props.user.birthdate.toDate().toISOString()
      )
        .toFormat(DASHED_DATE)
        .split("-");
      formDispatch({ field: "birthMonth", value: birthMonth });
      formDispatch({ field: "birthDay", value: birthDay });
      formDispatch({ field: "birthYear", value: birthYear });
    } else {
      formDispatch({ field: "birthMonth", value: initialFormState.birthMonth });
      formDispatch({ field: "birthDay", value: initialFormState.birthDay });
      formDispatch({ field: "birthYear", value: initialFormState.birthYear });
    }

    formDispatch({
      field: "website",
      value: props.user.website || initialFormState.website
    });
    formDispatch({
      field: "twitter",
      value: props.user.twitter || initialFormState.twitter
    });
    formDispatch({
      field: "twitch",
      value: props.user.twitch || initialFormState.twitch
    });
    formDispatch({
      field: "youtube",
      value: props.user.youtube || initialFormState.youtube
    });
    formDispatch({
      field: "skype",
      value: props.user.skype || initialFormState.skype
    });
    formDispatch({
      field: "discord",
      value: props.user.discord || initialFormState.discord
    });
    formDispatch({
      field: "battlenet",
      value: props.user.battlenet || initialFormState.battlenet
    });
    formDispatch({
      field: "steam",
      value: props.user.steam || initialFormState.steam
    });
    formDispatch({
      field: "xbox",
      value: props.user.xbox || initialFormState.xbox
    });
    formDispatch({
      field: "psn",
      value: props.user.psn || initialFormState.psn
    });
    setCurrentGames(props.user.currentlyPlaying || []);
    setFavoriteGames(props.user.favoriteGames || []);
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

    const schoolDocRef = firebase
      .firestore()
      .collection(COLLECTIONS.SCHOOLS)
      .doc(formState.school);

    let birthdate = "";

    if (formState.birthMonth && formState.birthDay && formState.birthYear) {
      const formattedBirthdate = DateTime.fromFormat(
        `${formState.birthMonth}-${formState.birthDay}-${formState.birthYear}`,
        DASHED_DATE
      );
      birthdate = firebase.firestore.Timestamp.fromDate(
        new Date(formattedBirthdate)
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

    firebase
      .firestore()
      .collection(COLLECTIONS.USERS)
      .doc(props.user.id)
      .update(data)
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
          description: error.message,
          status: "error",
          isClosable: true
        });
      });
  };

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
          <Flex alignItems="center" flexWrap="wrap">
            <Heading as="h2" size="2xl" pb={{ md: 0, sm: 6 }}>
              Your Profile
            </Heading>
            <Spacer />
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Options
              </MenuButton>
              <MenuList fontSize="md">
                <MenuItem onClick={openDeleteAccountDialog}>
                  Delete account
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Button
            colorScheme="brand"
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
            email={props.authUser.email}
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
            schoolName={props.school.formattedName}
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
            colorScheme="brand"
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

      <DeleteAccountDialog
        user={props.user}
        isOpen={isDeletingAccountAlertOpen}
        onClose={closeDeleteAccountDialog}
      />
    </React.Fragment>
  );
};

////////////////////////////////////////////////////////////////////////////////
// DetailSection

const DetailSection = React.memo(props => {
  const bioCharactersRemaining = React.useMemo(
    () => (props.bio ? MAX_BIO_LENGTH - props.bio.length : MAX_BIO_LENGTH),
    [props.bio]
  );

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
            flexBasis={{ md: "50%", sm: "100%" }}
            pr={{ md: 4, sm: 0 }}
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
            flexBasis={{ md: "50%", sm: "100%" }}
            pt={{ md: 0, sm: 6 }}
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
          width={{ md: "50%", sm: "100%" }}
          pr={{ md: 4, sm: 0 }}
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
          width={{ md: "50%", sm: "100%" }}
          pr={{ md: 4, sm: 0 }}
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
              flexBasis={{ md: "33.3333%", sm: "100%" }}
              pr={{ md: 4, sm: 0 }}
            >
              <FormLabel htmlFor="birthMonth" fontSize="sm" fontWeight="bold">
                Month
              </FormLabel>
              <MonthSelect
                id="birthMonth"
                name="birthMonth"
                onChange={props.handleFieldChange}
                value={props.birthMonth}
                size="lg"
              />
              <FormErrorMessage>{props.errors.birthMonth}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={props.errors.birthDay}
              flexBasis={{ md: "33.3333%", sm: "100%" }}
              pr={{ md: 4, sm: 0 }}
            >
              <FormLabel htmlFor="birthDay" fontSize="sm" fontWeight="bold">
                Day
              </FormLabel>
              <DaySelect
                id="birthDay"
                name="birthDay"
                onChange={props.handleFieldChange}
                value={props.birthDay}
                size="lg"
              />
              <FormErrorMessage>{props.errors.birthDay}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={props.errors.birthYear}
              flexBasis={{ md: "33.3333%", sm: "100%" }}
            >
              <FormLabel htmlFor="birthYear" fontSize="sm" fontWeight="bold">
                Year
              </FormLabel>
              <YearSelect
                id="birthYear"
                name="birthYear"
                onChange={props.handleFieldChange}
                value={props.birthYear}
                size="lg"
                min={CURRENT_YEAR - 100}
                max={CURRENT_YEAR + 1}
                reverseOptions
              />
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
          width={{ md: "50%", sm: "100%" }}
          pr={{ md: 4, sm: 0 }}
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
            {TIMEZONES.map(status => (
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

////////////////////////////////////////////////////////////////////////////////
// SchoolSection

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
          width={{ md: "50%", sm: "100%" }}
          pr={{ md: 4, sm: 0 }}
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
            {STUDENT_STATUS_OPTIONS.map(status => (
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
            flexBasis={{ md: "50%", sm: "100%" }}
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
            flexBasis={{ md: "50%", sm: "100%" }}
            pt={{ md: 0, sm: 6 }}
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

////////////////////////////////////////////////////////////////////////////////
// SocialAccountsSection

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
        {Object.keys(ACCOUNTS).map(id => {
          const account = ACCOUNTS[id];

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

////////////////////////////////////////////////////////////////////////////////
// FavoriteGamesSection

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
            disabled={props.favoriteGames.length === MAX_FAVORITE_GAME_LIST}
          />
        </FormControl>
        <FormErrorMessage>{props.errors.favoriteGames}</FormErrorMessage>
        <Stack spacing={2}>
          <Text fontWeight="bold">
            Your favorites{" "}
            <Text
              as="span"
              color={`${
                props.favoriteGames.length === MAX_FAVORITE_GAME_LIST
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
                        colorScheme="red"
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

////////////////////////////////////////////////////////////////////////////////
// CurrentlyPlayingSection

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
            disabled={
              props.currentlyPlaying.length === MAX_CURRENTLY_PLAYING_LIST
            }
          />
          <FormErrorMessage>{props.errors.favoriteGames}</FormErrorMessage>
        </FormControl>
        <Stack spacing={2}>
          <Text fontWeight="bold">
            What you’re playing{" "}
            <Text
              as="span"
              color={`${
                props.currentlyPlaying.length === MAX_CURRENTLY_PLAYING_LIST
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
                        colorScheme="red"
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
