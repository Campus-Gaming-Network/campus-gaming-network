import React from "react";
import { Router, Link as ReachLink, Redirect, navigate } from "@reach/router";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";
import "@reach/skip-nav/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faMapMarkerAlt,
  faUserFriends,
  faStar,
  faHeartBroken,
  faHome,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import capitalize from "lodash.capitalize";
import xorBy from "lodash.xorby";
import sortBy from "lodash.sortby";
import maxBy from "lodash.maxby";
import truncate from "lodash.truncate";
import omitBy from "lodash.omitby";
import isNil from "lodash.isnil";
import startCase from "lodash.startcase";
import Gravatar from "react-gravatar";
// TODO: Replace moment with something smaller
import moment from "moment";
import {
  ThemeProvider,
  CSSReset,
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
  FormErrorMessage,
  Spinner,
  Tooltip,
  Checkbox,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Alert,
  Badge,
  Link as ChakraLink,
  List,
  ListItem,
  useToast
} from "@chakra-ui/core";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import Amplify, { Auth } from "aws-amplify";
import PlacesAutocomplete from "react-places-autocomplete";
import "./App.css";
import awsconfig from "./aws-exports";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebase-config";
import TEST_DATA from "./test_data";
import * as constants from "./constants";
import {
  getEventResponses,
  getEventGoers,
  sortedEvents,
  classNames,
  useFormFields,
  createGravatarHash
} from "./utilities";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";
import { useAuthState } from "react-firebase-hooks/auth";

moment.locale("en");
momentLocalizer();

Amplify.configure(awsconfig);

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

////////////////////////////////////////////////////////////////////////////////
// App

const App = () => {
  const [authenticatedUser, isAuthenticating, error] = useAuthState(
    firebase.auth()
  );
  const isAuthenticated = !!authenticatedUser;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [user, isLoadingUserProfile, userProfileError] = useFetchUserProfile(
    authenticatedUser
  );
  const [school, isLoadingSchool, schoolError] = useFetchUserSchool(user);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(() => navigate("/"));
  }

  console.log({ authenticatedUser, isAuthenticating, error });

  // Since loading the user session is an asynchronous process,
  // we want to ensure that our app does not change states when
  // it first loads. To do this we’ll hold off rendering our app
  // till isAuthenticating is false.
  //
  // TODO: Display non-interactive silhouette instead?
  // Staring at a white screen while waiting for these is kind of
  // a bad user experience IMO.
  if (isAuthenticating || (!isAuthenticating && isLoadingUserProfile)) {
    return null;
  }

  const appProps = {
    isAuthenticated,
    authenticatedUser,
    user,
    school,
    handleLogout,
    isMenuOpen,
    setIsMenuOpen,
    CURRENT_USER: constants.CURRENT_USER
  };

  console.log({ appProps });

  return (
    <ThemeProvider>
      <CSSReset />
      <SkipNavLink />
      <header className="sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3 bg-purple-800">
        <Flex itemsCenter justifyBetween className="px-4 py-3 sm:p-0">
          <Link
            to="/"
            className="active:outline text-gray-200 hover:text-gray-300 hover:underline focus:underline flex items-center text-3xl"
          >
            <FontAwesomeIcon icon={faHome} />
            <span className="font-medium pl-4 text-logo">CGN</span>
          </Link>
          <div className="sm:hidden ml-auto">
            <button
              type="button"
              onClick={toggleMenu}
              className="block text-gray-500 hover:text-gray-600 focus:text-gray-600"
            >
              <FontAwesomeIcon
                icon={isMenuOpen ? faTimes : faBars}
                className="text-3xl"
              />
            </button>
          </div>
        </Flex>
        <Nav {...appProps} />
      </header>
      <main className="pb-12">
        <SkipNavContent />
        <Router>
          <ScrollToTop default>
            <Home path="/" {...appProps} />
            <EditUser path="user/edit" {...appProps} />
            <User path="user/:id" {...appProps} />
            <EditSchool path="school/edit" {...appProps} />
            <School path="school/:id" {...appProps} />
            <CreateEvent path="event/create" {...appProps} />
            <Event path="event/:id" {...appProps} />
            <Signup path="register" {...appProps} />
            <Login path="login" {...appProps} />
            <ForgotPassword path="forgot-password" {...appProps} />
            <NotFound default />
          </ScrollToTop>
        </Router>
      </main>
      <footer className="bg-gray-200 text-lg border-t-2 border-gray-300">
        <Flex
          tag="section"
          itemsCenter
          justifyAround
          className="max-w-4xl mx-auto p-8"
        >
          <Link to="about" className={constants.STYLES.LINK.DEFAULT}>
            About
          </Link>
          <Link to="contribute" className={constants.STYLES.LINK.DEFAULT}>
            Contribute
          </Link>
          <Link to="contact" className={constants.STYLES.LINK.DEFAULT}>
            Contact
          </Link>
        </Flex>
      </footer>
    </ThemeProvider>
  );
};

export default App;

////////////////////////////////////////////////////////////////////////////////
// Signup

const Signup = props => {
  const [fields, handleFieldChange] = useFormFields({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    school: "",
    status: ""
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [schools, setSchools] = React.useState([]);
  const [schoolOptions, setSchoolOptions] = React.useState([]);
  const [isShowingPassword, setIsShowingPassword] = React.useState(false);

  // TODO: Impractical, we should use Algolia or ElasticSearch to query these
  React.useEffect(() => {
    const loadSchools = async () => {
      db.collection("schools")
        .get()
        .then(snapshot => {
          setSchools(snapshot.docs);
          setSchoolOptions(
            sortBy(
              snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })),
              ["name"]
            )
          );
        });
    };

    loadSchools();
  }, []);

  if (props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);

    firebase
      .auth()
      .createUserWithEmailAndPassword(fields.email, fields.password)
      .then(({ user }) => {
        db.collection("users")
          .doc(user.uid)
          .set({
            firstName: fields.firstName,
            lastName: fields.lastName,
            status: fields.status,
            gravatar: createGravatarHash(fields.email),
            school: schools.find(school => school.id === fields.school).ref
          });
        setIsSubmitting(false);
      })
      .catch(error => {
        alert(error.message);
        setIsSubmitting(false);
      });
  }

  function togglePasswordVisibility() {
    setIsShowingPassword(!isShowingPassword);
  }

  return (
    <PageWrapper>
      <Box
        as="fieldset"
        borderWidth="1px"
        boxShadow="lg"
        rounded="lg"
        bg="white"
        pos="relative"
        p={12}
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-5xl font-bold leading-none">Create an account</h1>
          <hr className="my-12" />
          <div className="md:flex md:items mb-6">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              autoFocus
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Jane"
              required
              onChange={handleFieldChange}
              value={fields.firstName}
            />
          </div>
          <div className="md:flex md:items-center mb-6">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              required
              onChange={handleFieldChange}
              value={fields.lastName}
            />
          </div>
          <div className="md:flex md:items-center mb-6">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jdoe@gmail.com"
              required
              onChange={handleFieldChange}
              value={fields.email}
            />
          </div>
          <div className="md:flex md:items-stretch mb-6">
            <Label htmlFor="password">Password</Label>
            <div className="w-full">
              <Input
                id="password"
                name="password"
                type={isShowingPassword ? "text" : "password"}
                placeholder="******************"
                required
                onChange={handleFieldChange}
                value={fields.password}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-sm italic"
              >
                {isShowingPassword ? "Hide" : "Show"} password
              </button>
              <div className="text-sm">
                <p className="font-bold mt-4">Password Must</p>
                <ul className="flex flex-wrap list-disc pl-4">
                  <li className="w-1/2">Have One number</li>
                  <li className="w-1/2">Have One uppercase character</li>
                  <li className="w-1/2">Have One lowercase character</li>
                  <li className="w-1/2">Have One special character</li>
                  <li className="w-1/2">Have 8 characters minimum</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <Label htmlFor="school">School</Label>
            <ChakraSelect
              id="school"
              required
              onChange={handleFieldChange}
              value={fields.school}
              size="lg"
            >
              <option value="">Select a school</option>
              {schoolOptions.map(school => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </ChakraSelect>
          </div>
          <div className="md:flex md:items-center">
            <Label htmlFor="status">Status</Label>
            <ChakraSelect
              id="status"
              required
              onChange={handleFieldChange}
              value={fields.status}
              size="lg"
            >
              {constants.STUDENT_STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </ChakraSelect>
          </div>
          <Button
            disabled={isSubmitting}
            variant="purple"
            type="submit"
            className="my-12 w-full"
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </Button>
          <p>
            Already a member?{" "}
            <Link to="/login" className={constants.STYLES.LINK.DEFAULT}>
              Log in
            </Link>
          </p>
        </form>
      </Box>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// Login

// TODO: Handle unconfirmed users. Allow confirmation code to be resent and
// entered again.

const Login = props => {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = React.useState(false);

  if (props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(fields.email, fields.password)
      .then(() => {
        navigate("/");
      })
      .catch(error => {
        alert(error.message);
      });

    setIsLoading(false);
  }

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  return (
    <PageWrapper>
      <Box
        as="fieldset"
        borderWidth="1px"
        boxShadow="lg"
        rounded="lg"
        bg="white"
        pos="relative"
        p={12}
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-5xl font-bold leading-none mb-4">
            Welcome back!
          </h1>
          <p className="text-gray-600">Log in to your account</p>
          <hr className="my-12" />
          <div className="md:flex md:items-center mb-6">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jdoe123@gmail.com"
              required
              onChange={handleFieldChange}
              value={fields.email}
            />
          </div>
          <div className="md:flex md:items-center">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="******************"
              required
              onChange={handleFieldChange}
              value={fields.password}
            />
          </div>
          <Button
            disabled={isLoading || !validateForm()}
            variant="purple"
            type="submit"
            className="my-12 w-full"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
          <Flex itemsCenter justifyBetween>
            <p>
              Don’t have an account?{" "}
              <Link to="/register" className={constants.STYLES.LINK.DEFAULT}>
                Create one
              </Link>
            </p>
            <Link
              to="/forgot-password"
              className={`${constants.STYLES.LINK.DEFAULT}`}
            >
              Forgot your password?
            </Link>
          </Flex>
        </form>
      </Box>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// ForgotPassword

const ForgotPassword = props => {
  const [fields, handleFieldChange] = useFormFields({
    confirmationCode: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isSendingCode, setIsSendingCode] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);

  if (props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIsSendingCode(true);

    try {
      await Auth.forgotPassword(fields.email);
      setCodeSent(true);
    } catch (e) {
      alert(e.message);
      setIsSendingCode(false);
    }
  }

  async function handleConfirmationSubmit(e) {
    e.preventDefault();

    setIsConfirming(true);

    try {
      await Auth.forgotPasswordSubmit(
        fields.email,
        fields.confirmationCode,
        fields.password
      );
      setConfirmed(true);
    } catch (e) {
      alert(e.message);
      setIsConfirming(false);
    }
  }

  function validateCodeForm() {
    return fields.email.length > 0;
  }

  function validateResetForm() {
    return (
      fields.confirmationCode.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  if (codeSent) {
    if (confirmed) {
      return (
        <PageWrapper>
          <Alert status="success" variant="subtle">
            <span className="font-bold block text-2xl">
              Your password has been reset.
            </span>
            <p>
              <Link to="/login" className="hover:underline focus:underline">
                Click here to login with your new credentials.
              </Link>
            </p>
          </Alert>
        </PageWrapper>
      );
    }

    return (
      <PageWrapper>
        <Box
          as="fieldset"
          borderWidth="1px"
          boxShadow="lg"
          rounded="lg"
          bg="white"
          pos="relative"
          p={12}
        >
          <form onSubmit={handleConfirmationSubmit}>
            <Alert status="warning" variant="sbutle">
              <p className="font-medium">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="mr-4"
                />
                Please check your email ({fields.email}) for a confirmation
                code.
              </p>
            </Alert>
            <hr className="my-12" />
            <div className="md:flex md:items-center mb-6">
              <label
                className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4 w-1/3"
                htmlFor="confirmationCode"
              >
                Confirmation Code
              </label>
              <Input
                id="confirmationCode"
                name="confirmationCode"
                placeholder="12345"
                required
                autoFocus
                type="tel"
                onChange={handleFieldChange}
                value={fields.confirmationCode}
              />
            </div>
            <div className="md:flex md:items-center mb-6">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="******************"
                required
                onChange={handleFieldChange}
                value={fields.password}
              />
            </div>
            <div className="md:flex md:items-center mb-6">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="******************"
                required
                onChange={handleFieldChange}
                value={fields.confirmPassword}
              />
            </div>
            <Button
              disabled={isConfirming || !validateResetForm()}
              variant="purple"
              type="submit"
              className="my-12 w-full"
            >
              {isConfirming ? "Confirming..." : "Confirm"}
            </Button>
          </form>
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Box
        as="fieldset"
        borderWidth="1px"
        boxShadow="lg"
        rounded="lg"
        bg="white"
        pos="relative"
        p={12}
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-5xl font-bold leading-none mb-4">
            Reset your password
          </h1>
          <p className="text-gray-600">
            Enter the email you use for Campus Gaming Network, and we’ll help
            you create a new password.
          </p>
          <hr className="my-12" />
          <div className="md:flex md:items-center mb-6">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jdoe123@gmail.com"
              required
              onChange={handleFieldChange}
              value={fields.email}
            />
          </div>
          <Button
            disabled={isSendingCode || !validateCodeForm()}
            variant="purple"
            type="submit"
            className="my-12 w-full"
          >
            {isSendingCode ? "Sending..." : "Send Confirmation"}
          </Button>
          <Flex itemsCenter justifyBetween>
            <p>
              Go back to{" "}
              <Link to="/login" className={constants.STYLES.LINK.DEFAULT}>
                Login page
              </Link>
              .
            </p>
          </Flex>
        </form>
      </Box>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// Home

const Home = () => {
  return (
    <PageWrapper>
      <PageSection className="pt-0">
        <h1 className="text-logo text-6xl mb-8 leading-none">
          Campus Gaming Network
        </h1>
        <h2 className="text-3xl leading-tight text-gray-600">
          Connect with other collegiate gamers for casual or competitive gaming
          at your school or nearby.
        </h2>
      </PageSection>
      <PageSection>
        <h3 className="text-3xl font-semibold">
          Upcoming events near Chicago, IL
        </h3>
        {!constants.RANDOM_SAMPLE_OF_EVENTS.length ? (
          <p className="text-gray-500 text-2xl">
            There are no upcoming events coming up.
          </p>
        ) : (
          <ul>
            {sortedEvents(constants.RANDOM_SAMPLE_OF_EVENTS).map((event, i) => (
              <EventListItem key={event.id} event={event} />
            ))}
            <li className="flex items-center py-4 text-lg">
              <Link to="events" className={constants.STYLES.LINK.DEFAULT}>
                See all upcoming events around Chicago, IL
              </Link>
            </li>
          </ul>
        )}
      </PageSection>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// School

const School = props => {
  const [events, setEvents] = React.useState(null);
  const [users, setUsers] = React.useState(null);

  if (!props.school) {
    // TODO: Handle gracefully
    console.log("no school", { props });
    return null;
  }

  return (
    <PageWrapper>
      <Stack spacing={10}>
        <Box as="header" display="flex" alignItems="center">
          <Image
            src={props.school.logo}
            alt={`${props.school.name} school logo`}
            className="h-40 w-40 bg-gray-400 rounded-full border-4 border-gray-300"
          />
          <Box pl={12}>
            <Heading
              as="h1"
              fontSize="5xl"
              fontWeight="bold"
              pb={2}
              display="flex"
              alignItems="center"
            >
              {startCase(props.school.name.toLowerCase())}
            </Heading>
          </Box>
        </Box>
        <Box as="section" pt={4}>
          <VisuallyHidden as="h2">Description</VisuallyHidden>
          <Text>{props.school.description}</Text>
        </Box>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Information
          </Heading>
          <dl className="flex flex-wrap w-full">
            <dt className="w-1/2 font-bold">Contact Email</dt>
            {props.school.contactEmail ? (
              <dd className="w-1/2">
                <a
                  className={constants.STYLES.LINK.DEFAULT}
                  href={`mailto:${props.school.contactEmail}`}
                >
                  {props.school.contactEmail}
                </a>
              </dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
            <dt className="w-1/2 font-bold">Website</dt>
            {props.school.website ? (
              <dd className="w-1/2">
                <OutsideLink href={props.school.website}>
                  {props.school.website}
                </OutsideLink>
              </dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
            <dt className="w-1/2 font-bold">Address</dt>
            {props.school.address ? (
              <dd className="w-1/2">
                <OutsideLink
                  href={`${constants.GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(
                    props.school.address
                  )}`}
                >
                  {startCase(props.school.address.toLowerCase())}
                </OutsideLink>
              </dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
          </dl>
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Upcoming Events
          </Heading>
          {events && events.length ? (
            <List>
              {sortedEvents(events).map(event => (
                <EventListItem key={event.id} event={event} />
              ))}
            </List>
          ) : (
            <Text mt={4} className="text-gray-500">
              {constants.SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT}
            </Text>
          )}
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Members
          </Heading>
          {users && users.length ? (
            <List display="flex" flexWrap="wrap">
              {users.map(user => (
                <ListItem key={user.id} width="25%">
                  <Box
                    borderWidth="1px"
                    boxShadow="lg"
                    rounded="lg"
                    bg="white"
                    pos="relative"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    m={2}
                    p={4}
                    height="calc(100% - 1rem)"
                  >
                    <Avatar
                      src={user.picture}
                      alt={`Avatar for ${user.fullName}`}
                      rounded
                    />
                    <Link
                      to={`../../../user/${user.id}`}
                      className={`${constants.STYLES.LINK.DEFAULT} text-base leading-tight`}
                      fontWeight="bold"
                      mt={4}
                    >
                      {user.fullName}
                    </Link>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Text mt={4} color="gray.500">
              {constants.SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT}
            </Text>
          )}
        </Stack>
      </Stack>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// EditSchool

const EditSchool = props => {
  const [fields, handleFieldChange] = useFormFields({
    description: "",
    email: "",
    website: ""
  });
  const [locationSearch, setLocationSearch] = React.useState("");
  const [placeId, setPlaceId] = React.useState("");

  // if (!props.isAuthenticated) {
  //   return <Redirect to="/" noThrow />;
  // }

  // const user = TEST_DATA.users.find(user => user.id === props.id);

  // if (!user) {
  //   // TODO: Handle gracefully
  //   console.log("no user");
  //   return null;
  // }

  function setLocation(address, placeId) {
    setLocationSearch(address);
    setPlaceId(placeId);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Double check the address for a geocode if they blur or something
    // Probably want to save the address and lat/long
    // If we save the placeId, it may be easier to render the map for that place
    geocodeByAddress(locationSearch)
      .then(results => console.log({ results }))
      .catch(error => console.error({ error }));

    const data = {
      ...fields,
      ...{
        locationSearch,
        placeId
      }
    };

    console.log(data);
  }

  return (
    <PageWrapper>
      <Stack as="form" spacing={32} onSubmit={handleSubmit}>
        <Heading as="h1" size="2xl">
          Edit School
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
            <Text color="gray.500">Information about the school.</Text>
          </Box>
          <Stack spacing={6} p={8}>
            <FormControl>
              <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
                Contact email:
              </FormLabel>
              <ChakraInput
                id="email"
                name="email"
                type="email"
                placeholder="esports@school.edu"
                onChange={handleFieldChange}
                value={fields.email}
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
                          placeholder: "Where is the school located?",
                          className: "location-search-input"
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
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="Description" fontSize="lg" fontWeight="bold">
                Description:
              </FormLabel>
              <Textarea
                id="Description"
                name="Description"
                onChange={handleFieldChange}
                value={fields.Description}
                placeholder="Write a little something about the school"
                size="lg"
                resize="vertical"
                maxLength="300"
                h="150px"
              />
            </FormControl>
          </Stack>
        </Box>
        <ChakraButton
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          mt={-12}
        >
          Update School
        </ChakraButton>
      </Stack>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// User

const User = props => {
  const [events, setEvents] = React.useState([]);

  if (!props.user) {
    // TODO: Handle gracefully
    console.log("no user");
    return null;
  }

  if (!props.school) {
    console.log("no school");
  }

  return (
    <PageWrapper>
      <Box as="header" display="flex" alignItems="center">
        <Gravatar
          default={constants.GRAVATAR.DEFAULT}
          rating={constants.GRAVATAR.RA}
          md5={props.user ? props.user.gravatar : null}
          className="rounded-full border-4 bg-white border-gray-300 mr-2"
          size={150}
        />
        <Box pl={12}>
          <Heading
            as="h1"
            fontSize="5xl"
            fontWeight="bold"
            pb={2}
            display="flex"
            alignItems="center"
          >
            {props.user.firstName}
            {props.user.lastName ? ` ${props.user.lastName}` : ""}
          </Heading>
          <Heading
            as="h2"
            fontSize="2xl"
            fontWeight="normal"
            fontStyle="italic"
            display="flex"
            alignItems="center"
          >
            {props.user.isVerifiedStudent && (
              <Text className="text-base">
                <VisuallyHidden>User is a verified student</VisuallyHidden>
                <FontAwesomeIcon className="mr-1 text-blue-600" icon={faStar} />
              </Text>
            )}
            {`${
              props.user.status === "ALUMNI"
                ? "Alumni of "
                : props.user.status === "GRAD"
                ? "Graduate Student at "
                : `${capitalize(props.user.status)} at `
            }`}
            {props.school ? (
              <Link
                to={`/school/${props.school.ref.id}`}
                className={`${constants.STYLES.LINK.DEFAULT} ml-2`}
              >
                {startCase(props.school.name.toLowerCase())}
              </Link>
            ) : null}
          </Heading>
        </Box>
      </Box>
      <Stack spacing={10}>
        <Box as="section" pt={4}>
          <VisuallyHidden as="h2">Biography</VisuallyHidden>
          {props.user.bio ? <Text>{props.user.bio}</Text> : null}
        </Box>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Information
          </Heading>
          <Flex tag="dl" wrap className="w-full">
            <dt className="w-1/2 font-bold">Hometown</dt>
            {props.user.hometown ? (
              <dd className="w-1/2">{props.user.hometown}</dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
            <dt className="w-1/2 font-bold">Major</dt>
            {props.user.major ? (
              <dd className="w-1/2">{props.user.major}</dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
            <dt className="w-1/2 font-bold">Minor</dt>
            {props.user.minor ? (
              <dd className="w-1/2">{props.user.minor}</dd>
            ) : (
              <dd className="w-1/2 text-gray-500">Nothing set</dd>
            )}
          </Flex>
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Accounts
          </Heading>
          {Object.keys(constants.ACCOUNTS).length ? (
            <Box display="flex" as="ul" flexWrap="wrap" width="100%">
              {Object.keys(constants.ACCOUNTS).map(key => {
                const account = constants.ACCOUNTS[key];
                const value = props.user[key];

                if (!value) {
                  return null;
                }

                return (
                  <Box as="li" key={key}>
                    <Box
                      borderWidth="1px"
                      boxShadow="lg"
                      rounded="lg"
                      bg="white"
                      pos="relative"
                      alignItems="center"
                      display="flex"
                      px={4}
                      py={2}
                      mr={4}
                      mb={4}
                    >
                      <Box borderRight="1px" borderColor="gray.300" pr={4}>
                        <FontAwesomeIcon icon={account.icon} />
                      </Box>
                      <Box pl={4}>
                        <Text fontSize="sm">{account.label}</Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {value}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Text className="text-gray-500">
              {constants.USER_EMPTY_ACCOUNTS_TEXT}
            </Text>
          )}
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Currently Playing
          </Heading>
          {props.user.hasCurrentlyPlaying ? (
            <List display="flex" flexWrap="wrap">
              {props.user.currentlyPlaying.map(game => (
                <ListItem key={game.name} className="w-1/5">
                  <img
                    className="rounded h-40 shadow-lg"
                    src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`}
                    alt={`The cover art for ${game.name}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <p className="text-gray-500">
              {constants.USER_EMPTY_CURRENTLY_PLAYING_TEXT}
            </p>
          )}
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Favorite Games
          </Heading>
          {props.user.hasCurrentlyPlaying ? (
            <List display="flex" flexWrap="wrap">
              {props.user.favoriteGames.map(game => (
                <ListItem key={game.name} className="w-1/5">
                  <img
                    className="rounded h-40 shadow-lg"
                    src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`}
                    alt={`The cover art for ${game.name}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <p className="text-gray-500">
              {constants.USER_EMPTY_FAVORITE_GAMES_TEXT}
            </p>
          )}
        </Stack>
        <Stack as="section" spacing={4}>
          <Heading
            as="h3"
            fontSize="sm"
            textTransform="uppercase"
            color="gray.500"
          >
            Events Attending
          </Heading>
          {events.length ? (
            <List>
              {sortedEvents(events).map(event => (
                <EventListItem key={event.id} event={event} />
              ))}
            </List>
          ) : (
            <p className="text-gray-500">
              {constants.USER_EMPTY_UPCOMING_EVENTS_TEXT}
            </p>
          )}
        </Stack>
      </Stack>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// EditUser

const EditUser = props => {
  const [schools, setSchools] = React.useState([]);
  const [schoolOptions, setSchoolOptions] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();
  const initialFormState = props.user
    ? {
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        school: props.user.school.id,
        status: props.user.status,
        major: props.user.major,
        minor: props.user.minor,
        bio: props.user.bio,
        hometown: props.user.hometown,
        birthdate: props.user.birthdate,
        website: props.user.website,
        twitter: props.user.twitter,
        twitch: props.user.twitch,
        youtube: props.user.youtube,
        skype: props.user.skype,
        discord: props.user.discord,
        battlenet: props.user.battlenet,
        steam: props.user.steam,
        xbox: props.user.xbox,
        psn: props.user.psn,
        favoriteGameSearch: "",
        currentGameSearch: ""
      }
    : {};
  const [fields, handleFieldChange] = useFormFields({ ...initialFormState });
  const testFavoriteGames = Array.from({ length: 1 }, () => ({
    id: Math.floor(Math.random() * 100),
    name: "League of Legends",
    picture:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/lxoumgqbbj3erxgq6a6l.jpg"
  }));
  const testCurrentlyPlaying = Array.from({ length: 5 }, () => ({
    id: Math.floor(Math.random() * 100),
    name: "League of Legends",
    picture:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/lxoumgqbbj3erxgq6a6l.jpg"
  }));

  const [favoriteGames, setFavoriteGames] = React.useState(testFavoriteGames);
  const [currentlyPlaying, setCurrentGames] = React.useState(
    testCurrentlyPlaying
  );

  // TODO: Impractical, we should use Algolia or ElasticSearch to query these
  // React.useEffect(() => {
  //   const loadSchools = async () => {
  //     db.collection("schools")
  //       .get()
  //       .then(snapshot => {
  //         setSchools(snapshot.docs);
  //         setSchoolOptions(
  //           sortBy(
  //             snapshot.docs.map(doc => ({
  //               id: doc.id,
  //               ...doc.data()
  //             })),
  //             ["name"]
  //           )
  //         );
  //       });
  //   };

  //   loadSchools();
  // }, []);

  // React.useEffect(() => {
  //   if (user) {
  //     for (const key in user) {
  //       console.log(key);
  //       handleFieldChange({
  //         target: {
  //           id: key,
  //           value: user[key]
  //         }
  //       });
  //     }
  //   }
  // }, [user]);

  function toggleFavoriteGame(game) {
    setFavoriteGames(xorBy(favoriteGames, [game], "id"));
  }

  function toggleCurrentGame(game) {
    setCurrentGames(xorBy(currentlyPlaying, [game], "id"));
  }

  if (!props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);

    const data = {
      firstName: fields.firstName,
      lastName: fields.lastName,
      status: fields.status,
      hometown: fields.hometown,
      birthdate: new Date(moment(fields.birthdate)),
      major: fields.major,
      minor: fields.minor,
      bio: fields.bio,
      website: fields.website,
      twitter: fields.twitter,
      twitch: fields.twitch,
      youtube: fields.youtube,
      skype: fields.skype,
      discord: fields.discord,
      battlenet: fields.battlenet,
      steam: fields.steam,
      xbox: fields.xbox,
      psn: fields.psn
    };
    const matchedSchool = schools.find(school => school.id === fields.school);

    if (!!matchedSchool) {
      data.school = matchedSchool.ref;
    }

    const cleanedData = omitBy(data, isNil);

    db.collection("users")
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
  }

  if (!props.user) {
    // TODO: Handle gracefully
    console.log("no user");
    return null;
  }

  if (!props.authenticatedUser) {
    // TODO: Handle gracefully
    console.log("no authenticated user");
    return null;
  }

  return (
    <PageWrapper>
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
                onChange={handleFieldChange}
                value={fields.firstName}
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
                onChange={handleFieldChange}
                value={fields.lastName}
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
                value={props.authenticatedUser.email}
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
                onChange={handleFieldChange}
                value={fields.hometown}
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
                onChange={handleFieldChange}
                value={fields.birthdate}
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
                onChange={handleFieldChange}
                value={fields.bio}
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
          </Stack>
        </Box>
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
                onChange={handleFieldChange}
                value={fields.school}
                size="lg"
              >
                <option value="">Select a school</option>
                {schoolOptions.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="status" fontSize="lg" fontWeight="bold">
                Status:
              </FormLabel>
              <ChakraSelect
                id="status"
                onChange={handleFieldChange}
                value={fields.status}
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
                onChange={handleFieldChange}
                value={fields.major}
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
                onChange={handleFieldChange}
                value={fields.minor}
                size="lg"
              />
            </FormControl>
          </Stack>
        </Box>
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
              Social Accounts
            </Text>
            <Text color="gray.500">
              Other places where people can find you at.
            </Text>
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
                      onChange={handleFieldChange}
                      value={fields[id]}
                      roundedLeft="0"
                    />
                  </ChakraInputGroup>
                </FormControl>
              );
            })}
          </Stack>
        </Box>
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
              <ChakraInput
                id="favoriteGameSearch"
                name="favoriteGameSearch"
                type="text"
                onChange={handleFieldChange}
                value={fields.favoriteGameSearch}
                size="lg"
                disabled={favoriteGames.length === 5}
                placeholder="Search"
              />
            </FormControl>
            <Stack spacing={2}>
              <Text fontWeight="bold">
                Your favorites{" "}
                <Text
                  as="span"
                  color={`${favoriteGames.length === 5 ? "red" : undefined}`}
                >
                  ({favoriteGames.length}/5)
                </Text>
              </Text>
              :
              {favoriteGames.length === 0 ? (
                <Text color="gray.500">You haven’t selected any.</Text>
              ) : (
                <Stack isInline>
                  {favoriteGames.map(game => (
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
                        onClick={() => toggleFavoriteGame(game)}
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
              <ChakraInput
                id="currentGameSearch"
                name="currentGameSearch"
                type="text"
                onChange={handleFieldChange}
                value={fields.currentGameSearch}
                size="lg"
                disabled={currentlyPlaying.length === 5}
                placeholder="Search"
              />
            </FormControl>
            <Stack spacing={2}>
              <Text fontWeight="bold">
                What you’re playing{" "}
                <Text
                  as="span"
                  color={`${
                    currentlyPlaying.length === 5 ? "red.500" : undefined
                  }`}
                >
                  ({currentlyPlaying.length}/5)
                </Text>
              </Text>
              {currentlyPlaying.length === 0 ? (
                <Text color="gray.500">You haven’t selected any.</Text>
              ) : (
                <Stack isInline spacing={12} wrap="wrap">
                  {currentlyPlaying.map(game => (
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
                        onClick={() => toggleCurrentGame(game)}
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
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// Event

const Event = props => {
  const [isCancellationAlertOpen, setCancellationAlertIsOpen] = React.useState(
    false
  );
  const onCancellationAlertClose = () => setCancellationAlertIsOpen(false);
  const [isAttendingAlertOpen, setAttendingAlertOpen] = React.useState(false);
  const onAttendingAlertClose = () => setAttendingAlertOpen(false);
  const cancelRef = React.useRef();
  const attendRef = React.useRef();

  const event = TEST_DATA.events.find(event => event.id === props.id);

  if (!event) {
    // TODO: Handle gracefully
    console.log("no event");
    return null;
  }

  const school = TEST_DATA.schools[event.schoolId];

  if (!school) {
    // TODO: Handle gracefully
    console.log("no school");
    return null;
  }

  const eventResponses = getEventResponses(event.index);

  const eventGoers = getEventGoers(eventResponses);

  const hasResponded = TEST_DATA.event_responses.some(
    eventResponse =>
      eventResponse.userId === constants.TEST_USER.index &&
      eventResponse.id === event.id
  );

  function handleAttendSubmit(e) {
    e.preventDefault();

    setAttendingAlertOpen(true);

    if (!hasResponded) {
      const maxIndex = maxBy(TEST_DATA.event_responses, "index").index;

      TEST_DATA.event_responses = [
        ...TEST_DATA.event_responses,
        [
          {
            id: Math.random(),
            index: maxIndex + 1,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            eventId: event.index,
            userId: constants.TEST_USER.index,
            response: "YES"
          }
        ]
      ];
    }
  }

  function handleCancelSubmit(e) {
    e.preventDefault();
    setCancellationAlertIsOpen(true);
    // const response = window.confirm(
    //   "Are you sure you want to cancel your RSVP?"
    // );
    // if (response) {
    //   console.log("Confirmed");
    // } else {
    //   console.log("Cancelled");
    // }
  }

  console.log(TEST_DATA);

  return (
    <React.Fragment>
      <PageWrapper>
        <Stack spacing={10}>
          <Flex itemsCenter>
            <Box pr={2}>
              <Link
                to={`../../../school/${school.id}`}
                className={`${constants.STYLES.LINK.DEFAULT} text-lg`}
              >
                {school.name}
              </Link>
              <Heading as="h1" fontWeight="bold" fontSize="5xl" mb={2}>
                {event.title}
              </Heading>
            </Box>
            <Image
              src={school.logo}
              alt={`${school.name} school logo`}
              className="w-auto ml-auto bg-gray-400 h-24"
            />
          </Flex>
          <Stack as="section">
            <Box>
              <FontAwesomeIcon
                icon={faClock}
                className="text-gray-700 mr-2 text-lg"
              />
              <time dateTime={event.startDateTime}>
                {moment(event.startDateTime).calendar(
                  null,
                  constants.MOMENT_CALENDAR_FORMAT
                )}
              </time>{" "}
              to{" "}
              <time dateTime={event.endDateTime}>
                {moment(event.endDateTime).calendar(
                  null,
                  constants.MOMENT_CALENDAR_FORMAT
                )}
              </time>
            </Box>
            <Box>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-gray-700 mr-2 text-lg"
              />
              {event.location ? (
                <OutsideLink
                  href={`${constants.GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(
                    event.location
                  )}`}
                >
                  {event.location}
                </OutsideLink>
              ) : (
                <Text>To be determined</Text>
              )}
            </Box>
          </Stack>
          <Stack as="section" spacing={4}>
            {hasResponded ? (
              <form onSubmit={handleAttendSubmit}>
                <ChakraButton type="submit" variantColor="purple">
                  Attend Event
                </ChakraButton>
              </form>
            ) : (
              <form onSubmit={handleCancelSubmit}>
                <Alert
                  status="success"
                  variant="subtle"
                  flexDirection="column"
                  justifyContent="center"
                  textAlign="center"
                  height="100px"
                  rounded="lg"
                >
                  <Stack>
                    <Text fontWeight="bold" fontSize="2xl" color="green.500">
                      You’re going!
                    </Text>
                    <ChakraButton
                      type="submit"
                      variant="link"
                      color="green.500"
                      display="inline"
                    >
                      Cancel your RSVP
                    </ChakraButton>
                  </Stack>
                </Alert>
              </form>
            )}
          </Stack>
          <Stack as="section" spacing={4}>
            <Heading
              as="h2"
              fontSize="sm"
              textTransform="uppercase"
              color="gray.500"
            >
              Event Details
            </Heading>
            <p>{event.description}</p>
          </Stack>
          <Stack as="section" spacing={4}>
            {eventResponses.length ? (
              <Heading
                as="h4"
                fontSize="sm"
                textTransform="uppercase"
                color="gray.500"
              >
                Going ({eventResponses.length})
              </Heading>
            ) : null}
            <List display="flex" flexWrap="wrap">
              {eventGoers.map(user => (
                <ListItem key={user.id} width="25%">
                  <Box
                    borderWidth="1px"
                    boxShadow="lg"
                    rounded="lg"
                    bg="white"
                    pos="relative"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    m={2}
                    p={4}
                    height="calc(100% - 1rem)"
                  >
                    <Avatar
                      src={user.picture}
                      alt={`Avatar for ${user.fullName}`}
                      rounded
                    />
                    <Link
                      to={`../../../user/${user.id}`}
                      className={`${constants.STYLES.LINK.DEFAULT} text-base leading-tight`}
                      fontWeight="bold"
                      mt={4}
                    >
                      {user.fullName}
                    </Link>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Stack>
        </Stack>
      </PageWrapper>

      <AlertDialog
        isOpen={isAttendingAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAttendingAlertClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            RSVP
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to RSVP for {event.title}?
          </AlertDialogBody>

          <AlertDialogFooter>
            <ChakraButton ref={attendRef} onClick={onAttendingAlertClose}>
              No, nevermind
            </ChakraButton>
            <ChakraButton
              variantColor="purple"
              onClick={onAttendingAlertClose}
              ml={3}
            >
              Yes, I want to go
            </ChakraButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        isOpen={isCancellationAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCancellationAlertClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Cancel RSVP
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to cancel your RSVP for {event.title}?
          </AlertDialogBody>

          <AlertDialogFooter>
            <ChakraButton ref={cancelRef} onClick={onCancellationAlertClose}>
              No, nevermind
            </ChakraButton>
            <ChakraButton
              variantColor="red"
              onClick={onCancellationAlertClose}
              ml={3}
            >
              Yes, cancel the RSVP
            </ChakraButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
};

////////////////////////////////////////////////////////////////////////////////
// CreateEvent

const CreateEvent = props => {
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    description: "",
    eventHost: null
  });
  const [locationSearch, setLocationSearch] = React.useState("");
  const [startDateTime, setStartDateTime] = React.useState(new Date());
  const [endDateTime, setEndDateTime] = React.useState(new Date());
  const [placeId, setPlaceId] = React.useState("");
  const [isOnlineEvent, setIsOnlineEvent] = React.useState(false);
  // TODO: Tournament feature
  // const [isTournament, setIsTournament] = React.useState("no");

  // if (!props.isAuthenticated) {
  //   return <Redirect to="/" noThrow />;
  // }

  // const user = TEST_DATA.users.find(user => user.id === props.id);

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

    const data = {
      ...fields,
      ...{
        startDateTime,
        endDateTime,
        locationSearch,
        placeId,
        isOnlineEvent
      }
    };

    console.log(data);

    db.collection("events")
      .add({
        name: fields.name,
        description: fields.description,
        isOnlineEvent,
        startDateTime: firebase.firestore.Timestamp.fromDate(startDateTime),
        endDateTime: firebase.firestore.Timestamp.fromDate(endDateTime),
        placeId
      })
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      });
  }

  return (
    <PageWrapper>
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
        >
          Create Event
        </ChakraButton>
      </Stack>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// NotFound

const NotFound = () => {
  return (
    <PageWrapper>
      <p className="text-center text-3xl">
        Sorry, nothing here{" "}
        <FontAwesomeIcon icon={faHeartBroken} className="text-red-500" />
      </p>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// EventListItem

const EventListItem = props => {
  if (!props.event) {
    // TODO: Handle gracefully
    console.log("no event");
    return null;
  }

  const school = TEST_DATA.schools[props.event.schoolId];

  if (!school) {
    // TODO: Handle gracefully
    console.log("no school");
    return null;
  }

  const eventResponses = getEventResponses(props.event.index);

  return (
    <Box
      as="li"
      borderWidth="1px"
      boxShadow="lg"
      rounded="lg"
      bg="white"
      pos="relative"
      mt={4}
      py={6}
      px={8}
      display="flex"
      alignItems="center"
    >
      <Stack spacing={4}>
        <Box display="flex" alignItems="center">
          <Box pr={2}>
            <Link
              to={`../../school/${school.id}`}
              className={`${constants.STYLES.LINK.DEFAULT} text-xl leading-none`}
            >
              {school.name}
            </Link>
            <Link
              to={`../../event/${props.event.id}`}
              className={`${constants.STYLES.LINK.DEFAULT} block font-semibold text-3xl mt-1 leading-none`}
            >
              {props.event.title}
            </Link>
          </Box>
          <Image
            src={school.logo}
            alt={`${school.name} Logo`}
            className="w-auto ml-auto h-16"
          />
        </Box>
        <Box display="block">
          <FontAwesomeIcon icon={faClock} className="text-gray-700 mr-2" />
          <time className="text-lg" dateTime={props.event.startDateTime}>
            {moment(props.event.startDateTime).calendar(
              null,
              constants.MOMENT_CALENDAR_FORMAT
            )}
          </time>
        </Box>
        <Text fontSize="lg">
          {truncate(props.event.description, { length: 250 })}
        </Text>
        {eventResponses.length ? (
          <Badge
            variantColor="gray"
            variant="subtle"
            px={2}
            py={1}
            rounded="full"
            mr="auto"
          >
            <Box display="flex" alignItems="center">
              <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
              <Text>{eventResponses.length} Going</Text>
            </Box>
          </Badge>
        ) : null}
      </Stack>
    </Box>
  );
};

////////////////////////////////////////////////////////////////////////////////
// OutsideLink

const OutsideLink = ({ className = "", ...props }) => {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <ChakraLink
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames([constants.STYLES.LINK.DEFAULT, className])}
    />
  );
};

////////////////////////////////////////////////////////////////////////////////
// Button

const Button = ({ variant = "", className = "", ...props }) => {
  const defaultClass = `${
    constants.STYLES.BUTTON[
      variant.toUpperCase() || constants.STYLES.BUTTON.DEFAULT
    ]
  } border-2 font-semibold py-2 px-4 rounded-lg ${
    props.disabled ? "opacity-50 cursor-not-allowed" : ""
  }`.trim();

  return (
    <button {...props} className={classNames([defaultClass, className])} />
  );
};

////////////////////////////////////////////////////////////////////////////////
// Input

const Input = ({ error, className = "", ...props }) => {
  return (
    <input
      {...props}
      className={classNames([
        constants.STYLES.INPUT[error ? "ERROR" : "DEFAULT"],
        className
      ])}
    />
  );
};

////////////////////////////////////////////////////////////////////////////////
// Label

const Label = ({ className = "", ...props }) => {
  return (
    <label
      {...props}
      className={classNames([constants.STYLES.LABEL.DEFAULT, className])}
    />
  );
};

////////////////////////////////////////////////////////////////////////////////
// VisuallyHidden

const VisuallyHidden = ({ className = "", as = "span", ...props }) => {
  const CustomTag = `${as}`;

  return (
    <CustomTag
      {...props}
      className={classNames(["visually-hidden", className])}
    />
  );
};

////////////////////////////////////////////////////////////////////////////////
// PageWrapper

const PageWrapper = ({ className = "", ...props }) => {
  return (
    <article
      {...props}
      className={classNames([
        "max-w-4xl mx-auto my-16 px-8 text-xl",
        className
      ])}
    />
  );
};

////////////////////////////////////////////////////////////////////////////////
// PageSection

const PageSection = ({ className = "", ...props }) => {
  return (
    <section
      {...props}
      className={classNames([
        className.includes("pt-") ? "" : "pt-12",
        className
      ])}
    />
  );
};

////////////////////////////////////////////////////////////////////////////////
// Link

const Link = props => <ChakraLink as={ReachLink} {...props} />;

////////////////////////////////////////////////////////////////////////////////
// Avatar

const Avatar = ({
  size = "md",
  rounded = false,
  alt = "",
  className = "",
  ...props
}) => {
  let defaultClass = "bg-gray-400";

  if (rounded) {
    defaultClass += " rounded-full";
  }

  const sizes = {
    sm: "h-10 w-10",
    md: "h-20 w-20",
    lg: "h-40 w-40"
  };

  defaultClass += ` ${sizes[size]}`;

  if (props.children) {
    return (
      <Flex
        itemsCenter
        justifyCenter
        className={classNames([defaultClass, className])}
        {...props}
      />
    );
  }

  // eslint-disable-next-line
  return <img {...props} className={classNames([defaultClass, className])} />;
};

////////////////////////////////////////////////////////////////////////////////
// Flex

const Flex = ({
  tag = "div",
  direction = "row",
  className = "",
  itemsCenter,
  itemsEnd,
  itemsBaseline,
  itemsStart,
  itemsStretch,
  justifyAround,
  justifyCenter,
  justifyBetween,
  justifyStart,
  justifyEnd,
  wrap,
  noWrap,
  wrapReverse,
  ...props
}) => {
  const CustomTag = `${tag}`;

  return (
    <CustomTag
      {...props}
      className={classNames([
        "flex",
        direction === "row" ? "flex-row" : "",
        direction === "row-reverse" ? "flex-row-reverse" : "",
        direction === "col" ? "flex-col" : "",
        direction === "col-reverse" ? "flex-col-reverse" : "",
        itemsCenter ? "items-center" : "",
        itemsEnd ? "items-end" : "",
        itemsBaseline ? "items-baseline" : "",
        itemsStart ? "items-start" : "",
        itemsStretch ? "items-stretch" : "",
        justifyCenter ? "justify-center" : "",
        justifyEnd ? "justify-end" : "",
        justifyBetween ? "justify-between" : "",
        justifyStart ? "justify-start" : "",
        justifyAround ? "justify-around" : "",
        noWrap ? "flex-no-wrap" : "",
        wrap ? "flex-wrap" : "",
        wrapReverse ? "flex-wrap-reverse" : "",
        className
      ])}
    />
  );
};

////////////////////////////////////////////////////////////////////////////////
// Nav

const Nav = props => {
  return (
    <nav
      role="navigation"
      className={`${
        props.isMenuOpen ? "block" : "hidden"
      } px-2 pt-2 pb-4 sm:flex items-center sm:p-0`}
    >
      {props.isAuthenticated && props.user && props.school ? (
        <React.Fragment>
          {/* TODO: Remove when better spot is found */}
          <ChakraButton onClick={props.handleLogout}>Log out</ChakraButton>
          <Link
            to="/event/create"
            className="leading-none text-xl mx-5 rounded font-bold text-gray-200 hover:text-gray-300 bg-purple-700 py-2 px-3 hover:underline focus:underline"
          >
            Create an Event
          </Link>
          <Link
            to={`school/${props.school.ref.id}`}
            className="items-center text-xl flex mx-5 py-1 active:outline font-bold sm:rounded-none rounded text-gray-200 hover:text-gray-300 hover:underline focus:underline"
          >
            <img
              className="h-12 w-12 rounded-full border-4 bg-white border-gray-300 mr-2"
              src="https://i.pinimg.com/originals/da/63/b5/da63b5fb77c701640556c489b755a241.png"
              alt=""
            />
            School
          </Link>
          <Link
            to={`user/${props.user.ref.id}`}
            className="items-center text-xl flex mx-5 py-1 active:outline font-bold sm:rounded-none rounded text-gray-200 hover:text-gray-300 hover:underline focus:underline"
          >
            <Gravatar
              default={constants.GRAVATAR.DEFAULT}
              rating={constants.GRAVATAR.RA}
              md5={props.user ? props.user.gravatar : null}
              className="h-12 w-12 rounded-full border-4 bg-white border-gray-300 mr-2"
            />
            Profile
          </Link>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Link
            to="/login"
            className="text-xl block mx-3 py-1 active:outline sm:rounded text-gray-200 hover:text-gray-300 hover:underline focus:underline"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="text-xl mt-1 block mx-3 rounded font-bold text-gray-200 hover:text-gray-300 bg-purple-700 py-1 px-3 hover:underline focus:underline sm:mt-0 sm:ml-2"
          >
            Sign Up Free
          </Link>
        </React.Fragment>
      )}
    </nav>
  );
};

////////////////////////////////////////////////////////////////////////////////
// ConditionalWrapper

// eslint-disable-next-line
const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

////////////////////////////////////////////////////////////////////////////////
// ScrollToTop

const ScrollToTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location.pathname]);
  return children;
};

////////////////////////////////////////////////////////////////////////////////
// useFetchUserSchool

export const useFetchUserSchool = user => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [school, setSchool] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadSchool = async () => {
      setIsLoading(true);
      user.school
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            setSchool({
              ref: doc,
              ...data
            });
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error({ error });
          setError(error);
          setIsLoading(false);
        });
    };

    if (user) {
      loadSchool();
    }
  }, [user]);

  console.log({ isLoading, school, error });

  return [school, isLoading, error];
};

////////////////////////////////////////////////////////////////////////////////
// useFetchUserProfile

export const useFetchUserProfile = user => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      db.collection("users")
        .doc(user.uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            const data = doc.data();
            const hasFavoriteGames =
              data.favoriteGames && data.favoriteGames.length;
            const hasCurrentlyPlaying =
              data.currentlyPlaying && data.currentlyPlaying.length;

            setUserProfile({
              ref: doc,
              ...data,
              ...{
                hasFavoriteGames,
                hasCurrentlyPlaying
              }
            });
            setIsLoading(false);
          }
        })
        .catch(error => {
          console.error({ error });
          setError(error);
          setIsLoading(false);
        });
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  console.log({ isLoading, userProfile, error });

  return [userProfile, isLoading, error];
};
