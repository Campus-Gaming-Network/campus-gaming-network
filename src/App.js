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
import Amplify, { Auth } from "aws-amplify";
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
      if (e !== "No current user") {
        alert(e);
      }
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
    <React.Fragment>
      <SkipNavLink />
      <header className="sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3 bg-purple-800">
        <div className="flex items-center justify-between px-4 py-3 sm:p-0">
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
        </div>
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
                <Gravatar
                  email={appProps.currentUser.attributes.email}
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
      </header>
      <main className="pb-12">
        <SkipNavContent />
        <Router>
          <ScrollToTop default>
            <Home path="/" {...appProps} />
            <User path="user/:id" {...appProps} />
            <EditUser path="edit-user" {...appProps} />
            <School path="school/:id" {...appProps} />
            <EditSchool path="edit-school" {...appProps} />
            <Event path="event/:id" {...appProps} />
            <CreateEvent path="create-event" {...appProps} />
            <Signup path="register" {...appProps} />
            <Login path="login" {...appProps} />
            <ForgotPassword path="forgot-password" {...appProps} />
            <NotFound default />
          </ScrollToTop>
        </Router>
      </main>
      <footer className="bg-gray-200 text-lg border-t-2 border-gray-300">
        <section className="max-w-4xl mx-auto p-8 flex items-center justify-around">
          <Link to="about" className={constants.STYLES.LINK.DEFAULT}>
            About
          </Link>
          <Link to="contribute" className={constants.STYLES.LINK.DEFAULT}>
            Contribute
          </Link>
          <Link to="contact" className={constants.STYLES.LINK.DEFAULT}>
            Contact
          </Link>
        </section>
      </footer>
    </React.Fragment>
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
    console.log("handlesubmit");
    e.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password
      });
      setNewUser(newUser);
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
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
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
        <form
          onSubmit={handleConfirmationSubmit}
          className="w-full mx-auto p-12 bg-white border-4 rounded-lg"
        >
          <Alert variant="yellow">
            <p className="font-medium">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-4" />
              Please check your email ({fields.email}) for a confirmation code.
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
          <Button
            disabled={isLoading || !validateConfirmationForm()}
            variant="purple"
            type="submit"
            className="my-12 w-full"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto p-12 bg-white border-4 rounded-lg"
      >
        <h1 className="text-5xl font-bold leading-none flex items-center">
          Create an account
        </h1>
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
    </PageWrapper>
  );
};

////////////////////////////////////////////////////////////////////////////////
// Login

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
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto p-12 bg-white border-4 rounded-lg"
      >
        <h1 className="text-5xl font-bold leading-none mb-4">Welcome back!</h1>
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
        <div className="flex items-center justify-between">
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
        </div>
      </form>
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
        <form
          onSubmit={handleConfirmationSubmit}
          className="w-full mx-auto p-12 bg-white border-4 rounded-lg"
        >
          <Alert variant="yellow">
            <p className="font-medium">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-4" />
              Please check your email ({fields.email}) for a confirmation code.
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
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto p-12 bg-white border-4 rounded-lg"
      >
        <h1 className="text-5xl font-bold leading-none mb-4">
          Reset your password
        </h1>
        <p className="text-gray-600">
          Enter the email you use for Campus Gaming Network, and we’ll help you
          create a new password.
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
        <div className="flex items-center justify-between">
          <p>
            Go back to{" "}
            <Link to="/login" className={constants.STYLES.LINK.DEFAULT}>
              Login page
            </Link>
            .
          </p>
        </div>
      </form>
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
                <img
                  className="w-20 h-20 bg-gray-400 rounded-full"
                  src={user.picture}
                  alt={`Avatar for ${user.fullName}`}
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
      <header className="flex items-center">
        <img
          className="h-40 w-40 bg-gray-400 rounded-full border-4 border-gray-300"
          src={user.picture}
          alt=""
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
      </header>
      <PageSection>
        <VisuallyHidden>Biography</VisuallyHidden>
        {user.bio ? <p className="pt-1">{user.bio}</p> : null}
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-6">
          Information
        </h4>
        <dl className="flex flex-wrap w-full">
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
        </dl>
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600 bg-gray-200 rounded-lg px-8 py-1 inline-block mb-6">
          Game Accounts
        </h4>
        {user.gameAccounts.length ? (
          <dl className="flex flex-wrap w-full">
            {user.gameAccounts.map(account => (
              <React.Fragment key={account.name}>
                <dt className="w-1/2 font-bold">{account.name}</dt>
                <dd className="w-1/2">{account.value}</dd>
              </React.Fragment>
            ))}
          </dl>
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
          <ul className=" flex flex-wrap">
            {user.currentlyPlaying.map(game => (
              <li key={game.name} className="w-1/5">
                <img
                  className="rounded h-40 shadow-lg"
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`}
                  alt={`The cover art for ${game.name}`}
                />
              </li>
            ))}
          </ul>
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
          <ul className="flex flex-wrap">
            {user.favoriteGames.map(game => (
              <li key={game.name} className="w-1/5">
                <img
                  className="rounded h-40 shadow-lg"
                  src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`}
                  alt={`The cover art for ${game.name}`}
                />
              </li>
            ))}
          </ul>
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
  if (!props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted!");
  }

  return (
    <PageWrapper>
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto p-12 bg-white border-4 rounded-lg"
      >
        <h1 className="text-5xl font-bold leading-none mb-4">
          Edit Your Profile
        </h1>
        <hr className="my-12" />
        <div className="md:flex md:items-center mb-6">
          <Label htmlFor="first-name">First Name</Label>
          <Input
            id="first-name"
            name="first-name"
            type="text"
            placeholder="Jane"
            required
          />
        </div>
        <div className="md:flex md:items-center mb-6">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            id="last-name"
            name="last-name"
            type="text"
            placeholder="Doe"
            required
          />
        </div>
        <div className="md:flex md:items-start mb-6">
          <Label htmlFor="email">Email</Label>
          <div className="w-full">
            <p className="w-full">jdoe@gmail.com</p>
            <p className="text-gray-600 text-base italic">
              Your email cannot be changed.
            </p>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <Label htmlFor="school">School</Label>
          <Select id="school" required options={constants.SCHOOL_OPTIONS} />
        </div>
        <div className="md:flex md:items-center mb-6">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            required
            options={constants.STUDENT_STATUS_OPTIONS}
          />
        </div>
        <div className="md:flex md:items-start mb-6">
          <Label htmlFor="bio">Bio</Label>
          <div className="w-full">
            <textarea
              placeholder="Add your bio"
              maxLength="250"
              rows="4"
              className={`${constants.STYLES.INPUT.DEFAULT} resize-y`}
            />
            <p className="text-gray-600 text-base italic">
              Max 250 characters.
            </p>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <Label htmlFor="hometown">Hometown</Label>
          <Input
            id="hometown"
            name="hometown"
            type="text"
            placeholder="Chicago, IL"
          />
        </div>
        <div className="md:flex md:items-center mb-6">
          <Label htmlFor="birthdate">Birthday</Label>
          <Input id="birthdate" name="birthdate" type="date" />
        </div>
        <Button variant="purple" type="submit" className="my-12 w-full">
          Submit Changes
        </Button>
      </form>
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
      <div className="flex items-center">
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
      </div>
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
        <ul className="flex flex-wrap">
          {eventGoers.map(user => (
            <li key={user.id} className="w-1/3 md:w-1/4">
              <div className="flex flex-col items-center justify-around pt-6 pb-1 my-4 mr-4 bg-gray-200 border-4 rounded-lg">
                <img
                  className="w-20 h-20 bg-gray-400 rounded-full"
                  src={user.picture}
                  alt={`Avatar for ${user.fullName}`}
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
// CreateEvent

const CreateEvent = props => {
  if (!props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  return null;
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
    <li className="flex items-center bg-white border-4 rounded-lg mt-4 py-6 px-8">
      <div className="flex-initial w-full">
        <div className="flex items-center">
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
        </div>
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
    </li>
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
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown />
      </div>
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
// ScrollToTop

const ScrollToTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location.pathname]);
  return children;
};
