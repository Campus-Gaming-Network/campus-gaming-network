import React from "react";
import { Router, Link } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faMapMarkerAlt,
  faCalendar,
  faUserFriends,
  faStar,
  faHeartBroken
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import moment from "moment";
import { ReactComponent as Logo } from "./logo.svg";
import "./App.css";
import TEST_DATA from "./test_data";

////////////////////////////////////////////////////////////////////////////////
// Utilities

const getEventResponses = function getEventResponses(id, field = "eventId") {
  return TEST_DATA.event_responses.filter(function(event_response) {
    return event_response[field] === id;
  });
};

const getEventGoers = function getEventGoers(eventResponses) {
  return TEST_DATA.users.filter(function(user) {
    return eventResponses.find(function(eventResponse) {
      return eventResponse.userId === user.index;
    });
  });
};

const getEventsByResponses = function getEventsByResponses(eventResponses) {
  return TEST_DATA.events.filter(function(event) {
    return eventResponses.find(function(eventResponse) {
      return eventResponse.eventId === event.index;
    });
  });
};

const sortedEvents = function sortedEvents(events) {
  return _.orderBy(
    events,
    function(event) {
      return moment(moment(event.startDateTime));
    },
    ["desc"]
  );
};

const classNames = function classNamess(_classNames = []) {
  return _classNames.join(" ");
};

////////////////////////////////////////////////////////////////////////////////
// Constants

const MOMENT_DISPLAY_FORMAT = "ddd, MMM Do hh:mm a";

const MOMENT_CALENDAR_FORMAT = {
  sameElse: MOMENT_DISPLAY_FORMAT
};

const GOOGLE_MAPS_QUERY_URL =
  "https://www.google.com/maps/search/?api=1&query=";

const STYLES = {
  BUTTON: {
    DEFAULT: "bg-white border-gray-400 hover:bg-gray-200 text-gray-900",
    YELLOW:
      "bg-yellow-100 border-yellow-500 hover:bg-yellow-200 text-yellow-900",
    TEAL: "bg-teal-100 border-teal-700 hover:bg-teal-200 text-teal-700"
  },
  LINK: {
    DEFAULT:
      "font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline"
  }
};

////////////////////////////////////////////////////////////////////////////////
// TODO: Remove once actual data is implemented

const randomSampleOfEvents = _.slice(
  _.shuffle(TEST_DATA.events),
  0,
  Math.floor(Math.random() * 10)
);
const testUser = TEST_DATA.users[Math.floor(Math.random() * 250)];
const currentUser = {
  ...testUser,
  school: {
    ...TEST_DATA.schools[testUser.schoolId]
  },
  eventResponses: [...getEventResponses(testUser.index, "userId")],
  events: [getEventsByResponses(getEventResponses(testUser.index, "userId"))]
};

////////////////////////////////////////////////////////////////////////////////
// App

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [isLoggedIn, setIsLoggedIn] = React.useState(true);

  const toggledLoggedIn = () => setIsLoggedIn(!isLoggedIn);

  const authProps = {
    isLoggedIn,
    setIsLoggedIn,
    currentUser
  };

  return (
    <React.Fragment>
      <header className="sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3 bg-blue-700">
        <div className="flex items-center justify-between px-4 py-3 sm:p-0">
          <Link to="/">
            <Logo className="h-16" />
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
          } px-2 pt-2 pb-4 sm:flex sm:p-0`}
        >
          {isLoggedIn ? (
            <React.Fragment>
              <Link
                to={`school/${currentUser.school.id}`}
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
                to={`user/${currentUser.id}`}
                className="items-center text-xl flex mx-5 py-1 active:outline font-bold sm:rounded-none rounded text-gray-200 hover:text-gray-300 hover:underline focus:underline"
              >
                <img
                  className="h-12 w-12 rounded-full border-4 bg-white border-gray-300 mr-2"
                  src={currentUser.picture}
                  alt=""
                />
                Profile
              </Link>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link
                to="login"
                className="text-xl block mx-3 py-1 active:outline font-medium sm:rounded-none rounded font-bold text-gray-200 hover:text-gray-300 hover:underline focus:underline"
              >
                Log in
              </Link>
              <Link
                to="signup"
                className="text-xl mt-1 block mx-3 py-1 font-medium sm:rounded-none rounded font-bold text-gray-200 hover:text-gray-300 hover:underline focus:underline sm:mt-0 sm:ml-2"
              >
                Sign up
              </Link>
            </React.Fragment>
          )}
        </nav>
      </header>
      <main className="pb-12">
        <Router>
          <ScrollToTop default>
            <Home path="/" {...authProps} />
            <User path="user/:id" {...authProps} />
            <School path="school/:id" {...authProps} />
            <Event path="/event/:id" {...authProps} />
            <NotFound default {...authProps} />
          </ScrollToTop>
        </Router>
      </main>
      <footer className="bg-gray-200 text-lg border-t-2 border-gray-300">
        <section className="max-w-4xl mx-auto p-8 flex items-center justify-around">
          <Link to="about" className={STYLES.LINK.DEFAULT}>
            About
          </Link>
          <Link to="contribute" className={STYLES.LINK.DEFAULT}>
            Contribute
          </Link>
          <Link to="contact" className={STYLES.LINK.DEFAULT}>
            Contact
          </Link>
        </section>
      </footer>
    </React.Fragment>
  );
};

export default App;

////////////////////////////////////////////////////////////////////////////////
// Home

const Home = props => {
  return (
    <PageWrapper>
      <PageSection>
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
        {!randomSampleOfEvents.length ? (
          <p className="text-gray-500">
            There are no upcoming events coming up.
          </p>
        ) : (
          <ul>
            {sortedEvents(randomSampleOfEvents).map((event, i) => (
              <EventListItem key={event.id} event={event} />
            ))}
            <li className="flex items-center py-4 text-lg">
              <Link to="events" className={STYLES.LINK.DEFAULT}>
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
        <h4 className="font-bold uppercase text-sm pb-4 text-gray-600">
          Information
        </h4>
        <dl className="flex flex-wrap w-full">
          <dt className="w-1/2 font-bold">Contact Email</dt>
          {school.contactEmail ? (
            <dd className="w-1/2">
              <a
                className={STYLES.LINK.DEFAULT}
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
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
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
        <h4 className="font-bold uppercase text-sm text-gray-600">
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
            This school currently has no upcoming events.
          </p>
        )}
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600">Members</h4>
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
                  className={`${STYLES.LINK.DEFAULT} text-base m-4 mt-8 leading-tight font-bold text-center`}
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
              className={`${STYLES.LINK.DEFAULT} ml-1`}
            >
              {school.name}
            </Link>
          </h2>
        </div>
      </header>
      <PageSection>
        <VisuallyHidden>Biography</VisuallyHidden>
        <p className="pt-1">{user.bio}</p>
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm pb-4 text-gray-600">
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
        <h4 className="font-bold uppercase text-sm pb-4 text-gray-600">
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
            This user has not added any game accounts.
          </p>
        )}
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm pb-4 text-gray-600">
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
          <p className="text-gray-500">This user has not added any games.</p>
        )}
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm pb-4 text-gray-600">
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
          <p className="text-gray-500">This user has not added any games.</p>
        )}
      </PageSection>
      <PageSection>
        <h4 className="font-bold uppercase text-sm text-gray-600">
          Events Attending
        </h4>
        {events.length ? (
          <ul>
            {sortedEvents(events).map(event => (
              <EventListItem key={event.id} event={event} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">
            This user is currently not attending any upcoming events.
          </p>
        )}
      </PageSection>
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

  return (
    <PageWrapper>
      <div className="flex items-center">
        <div className="pr-2">
          <Link
            to={`../../../school/${school.id}`}
            className={`${STYLES.LINK.DEFAULT} text-lg`}
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
          icon={faCalendar}
          className="text-gray-700 mr-2 text-lg"
        />
        <time dateTime={event.startDateTime}>
          {moment(event.startDateTime).calendar(null, MOMENT_CALENDAR_FORMAT)}
        </time>
      </div>
      <div className="block pb-2">
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          className="text-gray-700 mr-2 text-lg"
        />
        {event.location ? (
          <OutsideLink
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
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
        <h2 className="font-bold">Event Details</h2>
        <p className="pt-4">{event.description}</p>
        {eventResponses.length ? (
          <h3 className="font-bold pt-12">
            {eventResponses.length}{" "}
            {eventResponses.length === 1 ? "person going" : "people going"}
          </h3>
        ) : null}
        <ul className="flex flex-wrap pt-4">
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
                  className={`${STYLES.LINK.DEFAULT} text-base m-4 mt-8 leading-tight font-bold text-center`}
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
    <li className="flex items-center bg-gray-200 border-4 rounded-lg mt-4 py-6 px-8">
      <div className="flex-initial w-full">
        <div className="flex items-center">
          <div className="pr-2">
            <Link
              to={`../../school/${school.id}`}
              className={`${STYLES.LINK.DEFAULT} text-xl leading-none`}
            >
              {school.name}
            </Link>
            <Link
              to={`../../event/${props.event.id}`}
              className={`${STYLES.LINK.DEFAULT} block font-semibold text-3xl mt-1 leading-none`}
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
        <div className="block pb-1 mt-4">
          <FontAwesomeIcon icon={faCalendar} className="text-gray-700 mr-2" />
          <time className="text-lg" dateTime={props.event.startDateTime}>
            {moment(props.event.startDateTime).calendar(
              null,
              MOMENT_CALENDAR_FORMAT
            )}
          </time>
        </div>
        <div className="block pb-2 mb-4 text-lg">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="text-gray-700 mr-2"
          />
          {props.event.location ? (
            <OutsideLink
              href={`${GOOGLE_MAPS_QUERY_URL}${encodeURIComponent(
                props.event.location
              )}`}
            >
              {props.event.location}
            </OutsideLink>
          ) : (
            <span>To be determined</span>
          )}
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
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames([STYLES.LINK.DEFAULT, className])}
    />
  );
};

////////////////////////////////////////////////////////////////////////////////
// Button

const Button = ({ variant = "", className = "", ...props }) => {
  const defaultClass = `${
    STYLES.BUTTON[variant.toUpperCase() || STYLES.BUTTON.DEFAULT]
  } border-2 font-semibold py-2 px-4 rounded-lg`;

  return (
    <button {...props} className={classNames([defaultClass, className])} />
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
  return <article {...props} className={classNames(["pt-12", className])} />;
};

////////////////////////////////////////////////////////////////////////////////
// ScrollToTop

const ScrollToTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location.pathname]);
  return children;
};
