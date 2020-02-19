import React from "react";
import { Router, Link, Redirect, navigate } from "@reach/router";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";
import { Alert as ReachAlert } from "@reach/alert";
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
import _ from "lodash";
import Gravatar from "react-gravatar";
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
  Tooltip
} from "@chakra-ui/core";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import Amplify, { Auth } from "aws-amplify";
import PlacesAutocomplete from "react-places-autocomplete";
import "./App.css";
import awsconfig from "./aws-exports";
import TEST_DATA from "./test_data";
import * as constants from "./constants";
import {
  getEventResponses,
  getEventGoers,
  getEventsByResponses,
  sortedEvents,
  classNames,
  useFormFields
} from "./utilities";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";

moment.locale("en");
momentLocalizer();

Amplify.configure(awsconfig);

////////////////////////////////////////////////////////////////////////////////
// App

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAuthenticated, setUserIsAuthenticated] = React.useState(false);
  const [isAuthenticating, setIsAuthenticating] = React.useState(true);
  const [currentUser, setCurrenUser] = React.useState(null);

  async function onLoad() {
    try {
      await Auth.currentSession();

      const response = await Auth.currentAuthenticatedUser();

      setCurrenUser(response);
      setUserIsAuthenticated(true);
    } catch (e) {
      console.log(e);
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    setUserIsAuthenticated(false);

    navigate("/");
  }

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  React.useEffect(() => {
    onLoad();
  }, []);

  // Since loading the user session is an asynchronous process,
  // we want to ensure that our app does not change states when
  // it first loads. To do this we’ll hold off rendering our app
  // till isAuthenticating is false.
  if (isAuthenticating) {
    return null;
  }

  const appProps = {
    isAuthenticated,
    setUserIsAuthenticated,
    handleLogout,
    currentUser,
    CURRENT_USER: constants.CURRENT_USER
  };

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
        <nav
          role="navigation"
          className={`${
            isMenuOpen ? "block" : "hidden"
          } px-2 pt-2 pb-4 sm:flex items-center sm:p-0`}
        >
          {isAuthenticated ? (
            <React.Fragment>
              <Link
                to="/create-event"
                className="leading-none text-xl mx-5 rounded font-bold text-gray-200 hover:text-gray-300 bg-purple-700 py-2 px-3 hover:underline focus:underline"
              >
                Create an Event
              </Link>
              <Link
                to={`school/${constants.CURRENT_USER.school.id}`}
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
                to={`user/${constants.CURRENT_USER.id}`}
                className="items-center text-xl flex mx-5 py-1 active:outline font-bold sm:rounded-none rounded text-gray-200 hover:text-gray-300 hover:underline focus:underline"
              >
                {currentUser && (
                  <Gravatar
                    email={currentUser.attributes.email}
                    className="h-12 w-12 rounded-full border-4 bg-white border-gray-300 mr-2"
                  />
                )}
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
    status: "",
    confirmationCode: ""
  });
  const [newUser, setNewUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowingPassword, setIsShowingPassword] = React.useState(false);

  if (props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password
      });
      setNewUser(newUser);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      alert(e.message);
    }
  }

  function validateForm() {
    return (
      fields.firstName.length > 0 &&
      fields.lastName.length > 0 &&
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.school.length > 0 &&
      fields.status.length > 0
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleConfirmationSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode, {
        school: fields.school,
        status: fields.status,
        firstName: fields.firstName,
        lastName: fields.lastName
      });
      await Auth.signIn(fields.email, fields.password);
      props.setUserIsAuthenticated(true);
      navigate("/");
    } catch (e) {
      setIsLoading(false);
      alert(e.message);
    }
  }

  function togglePasswordVisibility() {
    setIsShowingPassword(!isShowingPassword);
  }

  if (newUser) {
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
            <Alert variant="yellow">
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
            <InputGroup>
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
            </InputGroup>
            <Button
              disabled={isLoading || !validateConfirmationForm()}
              variant="purple"
              type="submit"
              className="my-12 w-full"
            >
              {isLoading ? "Verifying..." : "Verify"}
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
            <Select
              id="school"
              required
              options={constants.SCHOOL_OPTIONS}
              onChange={handleFieldChange}
              value={fields.school}
            />
          </div>
          <div className="md:flex md:items-center">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              required
              options={constants.STUDENT_STATUS_OPTIONS}
              onChange={handleFieldChange}
              value={fields.status}
            />
          </div>
          <Button
            disabled={isLoading || !validateForm()}
            variant="purple"
            type="submit"
            className="my-12 w-full"
          >
            {isLoading ? "Submitting..." : "Sign Up"}
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

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      props.setUserIsAuthenticated(true);
      navigate("/");
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
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
          <Alert variant="green">
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
            <Alert variant="yellow">
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
  const school = TEST_DATA.schools.find(school => school.id === props.id);

  if (!school) {
    // TODO: Handle gracefully
    console.log("no school");
    return null;
  }

  const events = TEST_DATA.events.filter(
    event => event.schoolId === school.index
  );

  const users = TEST_DATA.users.filter(user => user.schoolId === school.index);

  return (
    <PageWrapper>
      <header className="flex items-center">
        <img
          src={school.logo}
          alt={`${school.name} school logo`}
          className="h-40 w-40 bg-gray-400 rounded-full border-4 border-gray-300"
        />
        <div className="pl-12">
          <h1 className="text-5xl font-bold leading-none pb-4 flex items-center">
            {school.name}
          </h1>
        </div>
      </header>
      <PageSection>
        <VisuallyHidden>Description</VisuallyHidden>
        <p className="pt-1">{school.description}</p>
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-6">
          Information
        </h4>
        <dl className="flex flex-wrap w-full">
          <dt className="w-1/2 font-bold">Contact Email</dt>
          {school.contactEmail ? (
            <dd className="w-1/2">
              <a
                className={constants.STYLES.LINK.DEFAULT}
                href={`mailto:${school.contactEmail}`}
              >
                {school.contactEmail}
              </a>
            </dd>
          ) : (
            <dd className="w-1/2 text-gray-500">Nothing set</dd>
          )}
          <dt className="w-1/2 font-bold">Website</dt>
          {school.website ? (
            <dd className="w-1/2">
              <OutsideLink href={school.website}>{school.website}</OutsideLink>
            </dd>
          ) : (
            <dd className="w-1/2 text-gray-500">Nothing set</dd>
          )}
          <dt className="w-1/2 font-bold">Address</dt>
          {school.address ? (
            <dd className="w-1/2">
              <OutsideLink
                href={`${constants.GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(
                  school.address
                )}`}
              >
                {school.address}
              </OutsideLink>
            </dd>
          ) : (
            <dd className="w-1/2 text-gray-500">Nothing set</dd>
          )}
        </dl>
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-6">
          Upcoming Events
        </h4>
        {events.length ? (
          <ul>
            {sortedEvents(events).map(event => (
              <EventListItem key={event.id} event={event} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">
            {constants.SCHOOL_EMPTY_UPCOMING_EVENTS_TEXT}
          </p>
        )}
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-6">
          Members
        </h4>
        <ul className="flex flex-wrap pt-4">
          {users.map(user => (
            <li key={user.id} className="w-1/3 md:w-1/4">
              <div className="flex flex-col items-center justify-around pt-6 pb-1 my-4 mr-4 bg-gray-200 border-4 rounded-lg">
                <Avatar
                  src={user.picture}
                  alt={`Avatar for ${user.fullName}`}
                  rounded
                />
                <Link
                  to={`../../../user/${user.id}`}
                  className={`${constants.STYLES.LINK.DEFAULT} text-base m-4 mt-8 leading-tight font-bold text-center`}
                >
                  {user.fullName}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </PageSection>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// EditSchool

const EditSchool = props => {
  if (!props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  return null;
};

////////////////////////////////////////////////////////////////////////////////
// User

const User = props => {
  const user = TEST_DATA.users.find(user => user.id === props.id);

  if (!user) {
    // TODO: Handle gracefully
    console.log("no user");
    return null;
  }

  const school = TEST_DATA.schools[user.schoolId];

  if (!school) {
    // TODO: Handle gracefully
    console.log("no school");
    return null;
  }

  const eventResponses = getEventResponses(user.index, "userId");

  const events = getEventsByResponses(eventResponses);

  return (
    <PageWrapper>
      <Flex tag="header" itemsCenter>
        <Avatar
          size="lg"
          className="border-4 border-gray-300"
          src={user.picture}
          rounded
        />
        <div className="pl-12">
          <h1 className="text-5xl font-bold leading-none pb-2 flex items-center">
            {user.firstName}
            {user.lastName ? ` ${user.lastName}` : ""}
          </h1>
          <h2 className="italic flex items-center">
            {user.isVerifiedStudent && (
              <span className="text-base">
                <VisuallyHidden>User is a verified student</VisuallyHidden>
                <FontAwesomeIcon className="mr-1 text-blue-600" icon={faStar} />
              </span>
            )}
            {`${
              user.status === "ALUMNI"
                ? "Alumni of "
                : user.status === "GRAD"
                ? "Graduate Student at "
                : `${_.capitalize(user.status)} at `
            }`}
            <Link
              to={`/school/${school.id}`}
              className={`${constants.STYLES.LINK.DEFAULT} ml-1`}
            >
              {school.name}
            </Link>
          </h2>
        </div>
      </Flex>
      <PageSection>
        <VisuallyHidden>Biography</VisuallyHidden>
        {user.bio ? <p className="pt-1">{user.bio}</p> : null}
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-6">
          Information
        </h4>
        <Flex tag="dl" wrap className="w-full">
          <dt className="w-1/2 font-bold">Hometown</dt>
          {user.hometown ? (
            <dd className="w-1/2">{user.hometown}</dd>
          ) : (
            <dd className="w-1/2 text-gray-500">Nothing set</dd>
          )}
          <dt className="w-1/2 font-bold">Major</dt>
          {user.major ? (
            <dd className="w-1/2">{user.major}</dd>
          ) : (
            <dd className="w-1/2 text-gray-500">Nothing set</dd>
          )}
          <dt className="w-1/2 font-bold">Minor</dt>
          {user.minor ? (
            <dd className="w-1/2">{user.minor}</dd>
          ) : (
            <dd className="w-1/2 text-gray-500">Nothing set</dd>
          )}
        </Flex>
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-6">
          Game Accounts
        </h4>
        {user.gameAccounts.length ? (
          <Flex tag="dl" wrap className="w-full">
            {user.gameAccounts.map(account => (
              <React.Fragment key={account.name}>
                <dt className="w-1/2 font-bold">{account.name}</dt>
                <dd className="w-1/2">{account.value}</dd>
              </React.Fragment>
            ))}
          </Flex>
        ) : (
          <p className="text-gray-500">
            {constants.USER_EMPTY_GAME_ACCOUNTS_TEXT}
          </p>
        )}
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-8">
          Currently Playing
        </h4>
        {user.currentlyPlaying.length ? (
          <Flex tag="ul" wrap>
            {user.currentlyPlaying.map(game => (
              <li key={game.name} className="w-1/5">
                <img
                  className="rounded h-40 shadow-lg"
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`}
                  alt={`The cover art for ${game.name}`}
                />
              </li>
            ))}
          </Flex>
        ) : (
          <p className="text-gray-500">
            {constants.USER_EMPTY_CURRENTLY_PLAYING_TEXT}
          </p>
        )}
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-8">
          Favorite Games
        </h4>
        {user.favoriteGames.length ? (
          <Flex tag="ul" wrap>
            {user.favoriteGames.map(game => (
              <li key={game.name} className="w-1/5">
                <img
                  className="rounded h-40 shadow-lg"
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`}
                  alt={`The cover art for ${game.name}`}
                />
              </li>
            ))}
          </Flex>
        ) : (
          <p className="text-gray-500">
            {constants.USER_EMPTY_FAVORITE_GAMES_TEXT}
          </p>
        )}
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-8">
          Events Attending
        </h4>
        {events.length ? (
          <ul>
            {sortedEvents(events).map(event => (
              <EventListItem key={event.id} event={event} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            {constants.USER_EMPTY_UPCOMING_EVENTS_TEXT}
          </p>
        )}
      </PageSection>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// EditUser

const EditUser = props => {
  const [fields, handleFieldChange] = useFormFields({
    firstName: "",
    lastName: "",
    school: "",
    status: "",
    major: "",
    minor: "",
    bio: "",
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
  });
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

  function toggleFavoriteGame(game) {
    setFavoriteGames(_.xorBy(favoriteGames, [game], "id"));
  }

  function toggleCurrentGame(game) {
    setCurrentGames(_.xorBy(currentlyPlaying, [game], "id"));
  }

  // if (!props.isAuthenticated) {
  //   return <Redirect to="/" noThrow />;
  // }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted!", fields);
  }

  // function validateForm() {
  //   return (
  //     fields.firstName.length > 0 &&
  //     fields.lastName.length > 0 &&
  //     fields.school.length > 0 &&
  //     fields.status.length > 0
  //   );
  // }

  return (
    <PageWrapper>
      <Stack as="form" spacing={32} onSubmit={handleSubmit}>
        <Heading as="h1" size="2xl">
          Your Profile
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
                value="jdoe@gmail.com"
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
            <FormControl isRequired>
              <FormLabel htmlFor="school" fontSize="lg" fontWeight="bold">
                School:
              </FormLabel>
              <ChakraSelect
                id="school"
                onChange={handleFieldChange}
                value={fields.school}
                size="lg"
              >
                {constants.SCHOOL_OPTIONS.map(option => (
                  <option key={option.value} {...option} />
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
                {constants.STUDENT_STATUS_OPTIONS.map(option => (
                  <option key={option.value} {...option} />
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
          variantColor="blue"
          type="submit"
          size="lg"
          w="full"
          mt={-12}
        >
          Update Profile
        </ChakraButton>
      </Stack>
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// Event

const Event = props => {
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

  const handleAttendSubmit = () => {
    if (!hasResponded) {
      const maxIndex = _.maxBy(TEST_DATA.event_responses, "index").index;

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
  };

  const handleCancelSubmit = () => {
    const response = window.confirm(
      "Are you sure you want to cancel your RSVP?"
    );
    if (response) {
      console.log("Confirmed");
    } else {
      console.log("Cancelled");
    }
  };

  console.log(TEST_DATA);

  return (
    <PageWrapper>
      <Flex itemsCenter>
        <div className="pr-2">
          <Link
            to={`../../../school/${school.id}`}
            className={`${constants.STYLES.LINK.DEFAULT} text-lg`}
          >
            {school.name}
          </Link>
          <h1 className="font-bold text-5xl mb-2 leading-none">
            {event.title}
          </h1>
        </div>
        <img
          src={school.logo}
          alt={`${school.name} school logo`}
          className="w-auto ml-auto bg-gray-400 h-24"
        />
      </Flex>
      <div className="block pb-1 mt-4">
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
      </div>
      <div className="block pb-2">
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
          <span>To be determined</span>
        )}
      </div>
      <PageSection>
        {hasResponded ? (
          <form onSubmit={handleAttendSubmit}>
            <Button variant="purple" type="submit">
              Attend Event
            </Button>
          </form>
        ) : (
          <form onSubmit={handleCancelSubmit}>
            <Alert variant="green">
              <span className="font-bold block text-2xl">You’re going!</span>
              <button type="submit" className="text-base focus:underline">
                Cancel your RSVP
              </button>
            </Alert>
          </form>
        )}
      </PageSection>
      <PageSection>
        <h2 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-6">
          Event Details
        </h2>
        <p>{event.description}</p>
      </PageSection>
      <PageSection>
        {eventResponses.length ? (
          <h3 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-6">
            Going ({eventResponses.length})
          </h3>
        ) : null}
        <Flex tag="ul" wrap>
          {eventGoers.map(user => (
            <li key={user.id} className="w-1/3 md:w-1/4">
              <Flex
                direction="col"
                itemsCenter
                justifyAround
                className="pt-6 pb-1 my-4 mr-4 bg-gray-200 border-4 rounded-lg"
              >
                <Avatar
                  src={user.picture}
                  alt={`Avatar for ${user.fullName}`}
                  rounded
                />
                <Link
                  to={`../../../user/${user.id}`}
                  className={`${constants.STYLES.LINK.DEFAULT} text-base m-4 mt-8 leading-tight font-bold text-center`}
                >
                  {user.fullName}
                </Link>
              </Flex>
            </li>
          ))}
        </Flex>
      </PageSection>
    </PageWrapper>
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

    console.log("Submitted!", {
      ...fields,
      ...{ startDateTime, endDateTime, locationSearch, placeId }
    });
  }

  // function validateForm() {
  //   return (
  //     fields.firstName.length > 0 &&
  //     fields.lastName.length > 0 &&
  //     fields.school.length > 0 &&
  //     fields.status.length > 0
  //   );
  // }

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
    <Card tag="li" className="mt-4 py-6 px-8 flex items-center">
      <div className="flex-initial w-full">
        <Flex itemsCenter>
          <div className="pr-2">
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
          </div>
          <img
            src={school.logo}
            alt={`${school.name} Logo`}
            className="w-auto ml-auto h-16"
          />
        </Flex>
        <div className="block my-4">
          <FontAwesomeIcon icon={faClock} className="text-gray-700 mr-2" />
          <time className="text-lg" dateTime={props.event.startDateTime}>
            {moment(props.event.startDateTime).calendar(
              null,
              constants.MOMENT_CALENDAR_FORMAT
            )}
          </time>
        </div>
        <p className="text-lg">
          {_.truncate(props.event.description, { length: 250 })}
        </p>
        {eventResponses.length ? (
          <div className="pt-4">
            <FontAwesomeIcon
              icon={faUserFriends}
              className="text-gray-700 mr-2"
            />
            <span>{eventResponses.length} Going</span>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

////////////////////////////////////////////////////////////////////////////////
// OutsideLink

const OutsideLink = ({ className = "", ...props }) => {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
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
// Alert

const Alert = ({ variant = "", className = "", ...props }) => {
  const defaultClass = `${
    constants.STYLES.ALERT[
      variant.toUpperCase() || constants.STYLES.ALERT.DEFAULT
    ]
  } rounded-lg px-8 py-4`;

  return (
    <ReachAlert {...props} className={classNames([defaultClass, className])} />
  );
};

////////////////////////////////////////////////////////////////////////////////
// Select

const Select = ({ options = [], className = "", ...props }) => {
  return (
    <div className="relative w-full">
      <select
        {...props}
        className={classNames([constants.STYLES.SELECT.DEFAULT, className])}
      >
        {options.map(option => (
          <option key={option.value} {...option} />
        ))}
      </select>
      <Flex
        className="pointer-events-none absolute inset-y-0 right-0 px-2 text-gray-700"
        itemsCenter
      >
        <ChevronDown />
      </Flex>
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////
// ChevronDown

const ChevronDown = ({ className = "", ...props }) => {
  return (
    <svg
      {...props}
      className={classNames(["fill-current h-4 w-4", className])}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
    </svg>
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
// InputGroup

const InputGroup = ({ align = "center", className = "", ...props }) => {
  let defaultClass = "md:flex mb-6";

  if (align === "center") {
    defaultClass = `${defaultClass} md:items-center`;
  } else if (align === "start") {
    defaultClass = `${defaultClass} md:items-start`;
  }

  return <div {...props} className={classNames([defaultClass, className])} />;
};

////////////////////////////////////////////////////////////////////////////////
// VisuallyHidden

const VisuallyHidden = ({ className = "", ...props }) => {
  return (
    <span {...props} className={classNames(["visually-hidden", className])} />
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
// Card

const Card = ({ tag = "div", className = "", ...props }) => {
  const CustomTag = `${tag}`;

  return (
    <CustomTag
      {...props}
      className={classNames(["bg-white border-4 rounded-lg", className])}
    />
  );
};

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
