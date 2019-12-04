import React from "react";
import { Router, Link } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faMapMarkerAlt,
  faCalendar,
  faUserFriends,
  faCheck,
  faStar
} from "@fortawesome/free-solid-svg-icons";
// import { ReactComponent as Logo } from "./logo.svg";
import "./App.css";

const DEFAULT_LINK_CLASSNAMES =
  "font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline";

const TEST_DATA = {
  events: [
    {
      id: "1",
      title: "General Body Meeting",
      url: "uic/events/1",
      schoolId: "1",
      dateTime: "2009-11-13T20:00Z",
      formattedDateTime: "Sun, Oct 3, 5:00pm",
      addressLink: "https://goo.gl/maps/hRWzpokHjpgQaon78",
      address: "212 Northern Ave, Boston, MA 02210",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque ullam blanditiis ut et ab delectus, inventore quos. Totam nihil explicabo quibusdam laboriosam fugiat commodi quam autem quaerat rem! Temporibus, aliquam!",
      going: "71"
    },
    {
      id: "1",
      title: "CSGO and Mountain Dew",
      url: "iit/events/1",
      schoolId: "2",
      dateTime: "2009-11-13T20:00Z",
      formattedDateTime: "Sun, Oct 3, 5:00pm",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque ullam blanditiis ut et ab delectus, inventore quos.",
      going: "4",
      response: "yes"
    },
    {
      id: "1",
      title: "LoL and Doritos",
      url: "uiuc/events/1",
      schoolId: "3",
      dateTime: "2009-11-13T20:00Z",
      formattedDateTime: "Sun, Oct 3, 5:00pm",
      addressLink: "https://goo.gl/maps/hRWzpokHjpgQaon78",
      address: "212 Northern Ave, Boston, MA 02210",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque ullam blanditiis ut et ab delectus, inventore quos. Totam nihil explicabo quibusdam laborio...",
      going: "23",
      response: "maybe"
    }
  ],
  users: [
    {
      id: "1",
      picture: "https://api.adorable.io/avatars/285/abott1@adorable",
      name: "Hicks Garza"
    },
    {
      id: "2",
      picture: "https://api.adorable.io/avatars/285/abott2@adorable",
      name: "Virgie Bender"
    },
    {
      id: "3",
      picture: "https://api.adorable.io/avatars/285/abott3@adorable",
      name: "Juanita Greer"
    },
    {
      id: "4",
      picture: "https://api.adorable.io/avatars/285/abott4@adorable",
      name: "Austin Simmons"
    },
    {
      id: "5",
      picture: "https://api.adorable.io/avatars/285/abott5@adorable",
      name: "Sasha Harding"
    },
    {
      id: "6",
      picture: "https://api.adorable.io/avatars/285/abott6@adorable",
      name: "Manning Stafford"
    },
    {
      id: "7",
      picture: "https://api.adorable.io/avatars/285/abott7@adorable",
      name: "James Wilkerson"
    }
  ],
  schools: [
    {
      id: "1",
      name: "University of Illinois at Chicago",
      handle: "university-of-illinois-at-chicago",
      abbreviation: "uic",
      logo: "https://theory.cs.uic.edu/images/uic.PNG",
      url: "school/uic"
    },
    {
      id: "2",
      name: "Illinois Institute of Technology",
      handle: "illinois-institute-of-technology",
      abbreviation: "iit",
      logo:
        "https://i.pinimg.com/originals/da/63/b5/da63b5fb77c701640556c489b755a241.png",
      url: "school/iit"
    },
    {
      id: "3",
      name: "University of Illinois Urbana-Champaign",
      handle: "university-of-illinois-urbana-champaign",
      abbreviation: "uiuc",
      logo:
        "http://content.sportslogos.net/logos/32/706/full/7639_illinois_fighting_illini-alternate-1989.png",
      url: "school/uiuc"
    }
  ]
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const toggledLoggedIn = () => setIsLoggedIn(!isLoggedIn);

  const authProps = {
    isLoggedIn,
    setIsLoggedIn
  };

  return (
    <React.Fragment>
      {/* Start Header */}
      <header className="sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-5">
        <div className="flex items-center justify-between px-4 py-3 sm:p-0">
          <div className="flex items-center">
            <Link to="/">{/* <Logo className="h-16" /> */}</Link>
          </div>
          <div className="sm:hidden">
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
                to="user/1"
                className="text-center text-xl block mx-5 py-1 active:outline font-medium sm:rounded-none rounded text-blue-700 hover:text-blue-800 hover:underline focus:underline"
              >
                <img
                  className="h-16 w-16 rounded-full border-4 border-gray-300"
                  src="https://randomuser.me/api/portraits/lego/8.jpg"
                  alt=""
                />
                Profile
              </Link>
              <Link
                to="iit"
                className="text-center text-xl block mx-5 py-1 active:outline font-medium sm:rounded-none rounded text-blue-700 hover:text-blue-800 hover:underline focus:underline"
              >
                <img
                  className="h-16 w-16 rounded-full border-4 border-gray-300"
                  src="https://i.pinimg.com/originals/da/63/b5/da63b5fb77c701640556c489b755a241.png"
                  alt=""
                />
                School
              </Link>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link
                to="login"
                className="text-xl block mx-3 py-1 active:outline font-medium sm:rounded-none rounded text-blue-700 hover:text-blue-800 hover:underline focus:underline"
              >
                Log in
              </Link>
              <Link
                to="signup"
                className="text-xl mt-1 block mx-3 py-1 font-medium sm:rounded-none rounded text-blue-700 hover:text-blue-800 hover:underline focus:underline sm:mt-0 sm:ml-2"
              >
                Sign up
              </Link>
            </React.Fragment>
          )}
        </nav>
      </header>
      {/* End Header */}
      {/* Start Body */}
      <main className="pb-12">
        <Router>
          <Home path="/" {...authProps} />
          <User path="user/:id" {...authProps} />
          <School path="school/:id" {...authProps} />
          <SchoolEvent path="/:school/events/:id" {...authProps} />
        </Router>
      </main>
      <footer className="bg-gray-200 text-lg border-t-2 border-gray-300">
        <section className="max-w-4xl mx-auto p-8 flex items-center justify-around">
          <Link to="about" className={DEFAULT_LINK_CLASSNAMES}>
            About
          </Link>
          <Link to="contribute" className={DEFAULT_LINK_CLASSNAMES}>
            Contribute
          </Link>
          <Link to="contact" className={DEFAULT_LINK_CLASSNAMES}>
            Contact
          </Link>
        </section>
        <button
          onClick={toggledLoggedIn}
          type="button"
          className="fixed top-0 left-0 ml-4 mt-4 rounded-lg border-2 border-black py-2 px-4 font-semibold bg-white"
        >
          {isLoggedIn ? "Log Out" : "Log In"}
        </button>
      </footer>
      {/* End Body */}
    </React.Fragment>
  );
};

const Home = props => {
  return (
    <React.Fragment>
      <div className="max-w-4xl mx-auto mt-8 mb-16 px-8">
        <h1 className="text-logo text-6xl mb-8 leading-none">
          Campus Gaming Network
        </h1>
        <h2 className="text-3xl text-gray-600">
          Connect with other collegiate gamers for casual or competitive gaming
          at your school or nearby.
        </h2>
      </div>
      <article className="max-w-4xl mx-auto mb-12 px-8">
        <h3 className="text-3xl font-semibold">
          Upcoming events near Chicago, IL
        </h3>
        <section>
          <ul>
            {TEST_DATA.events.map((event, i) => (
              <EventListItem
                key={event.schoolId + event.id}
                isFirst={i === 0}
                isLoggedIn={props.isLoggedIn}
                event
              />
            ))}
            <li className="flex items-center py-4 text-lg">
              <Link to="events" className={DEFAULT_LINK_CLASSNAMES}>
                See all upcoming events around Chicago, IL
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </React.Fragment>
  );
};

const EventListItem = props => {
  const [currResponse, setResponse] = React.useState(props.response);

  const toggleResponse = nextResponse => {
    if (currResponse === nextResponse) {
      setResponse("");
    } else {
      setResponse(nextResponse);
    }
  };

  if (!props.event) {
    return null;
  }

  const school = TEST_DATA.schools.find(
    school => school.id === props.event.schoolId
  );

  if (!school) {
    return null;
  }

  return (
    <li
      className={`flex items-center border-4 bg-white rounded-lg mt-4 py-6 px-8 ${
        !props.isFirst ? "border-t-4" : ""
      }`}
    >
      <div className="flex-initial">
        <div className="flex items-center">
          <div>
            <Link
              to={school.url}
              className={`${DEFAULT_LINK_CLASSNAMES} text-xl`}
            >
              {school.name}
            </Link>
            <Link
              to={props.url}
              className={`${DEFAULT_LINK_CLASSNAMES} block font-semibold text-3xl`}
            >
              {props.title}
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
          <time className="text-lg" dateTime={props.event.dateTime}>
            {props.event.formattedDateTime}
          </time>
        </div>
        <div className="block pb-2 mb-4 text-lg">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="text-gray-700 mr-2"
          />
          {props.event.address ? (
            <OutsideLink href={props.event.addressLink}>
              {props.event.address}
            </OutsideLink>
          ) : (
            <span>To be determined</span>
          )}
        </div>
        <p className="text-lg">{truncate(props.event.description, 250)}</p>
        <div className="pt-4">
          <FontAwesomeIcon
            icon={faUserFriends}
            className="text-gray-700 mr-2"
          />
          <span>{props.event.going} Going</span>
        </div>
        {props.event.isLoggedIn && (
          <div className="pt-8">
            <Button
              type="button"
              onClick={() => toggleResponse("yes")}
              variant={currResponse === "yes" ? "teal" : ""}
            >
              Going
              <FontAwesomeIcon
                icon={faCheck}
                className={`ml-2 ${
                  currResponse === "yes" ? "text-teal-800" : "text-gray-800"
                }`}
              />
            </Button>
            <Button
              type="button"
              onClick={() => toggleResponse("maybe")}
              variant={currResponse === "maybe" ? "yellow" : ""}
              className="ml-4"
            >
              Interested
              <FontAwesomeIcon
                icon={faStar}
                className={`ml-2 ${
                  currResponse === "maybe" ? "text-yellow-800" : "text-gray-800"
                }`}
              />
            </Button>
          </div>
        )}
      </div>
    </li>
  );
};

const OutsideLink = ({ children, className, ...rest }) => {
  return (
    <a
      {...rest}
      target="_blank"
      rel="noopener noreferrer"
      className={DEFAULT_LINK_CLASSNAMES}
    >
      {children}
    </a>
  );
};

const Button = ({ children, variant = "", className = "", ...rest }) => {
  const variants = {
    teal: "bg-teal-100 border-teal-700 hover:bg-teal-200 text-teal-700",
    yellow:
      "bg-yellow-100 border-yellow-500 hover:bg-yellow-200 text-yellow-900",
    default: "bg-white border-gray-400 hover:bg-gray-200 text-gray-900"
  };
  const defaultClass = `${
    variants[variant || "default"]
  } border-2 font-semibold py-2 px-4 rounded-lg`;

  return (
    <button {...rest} className={[defaultClass, className].join(" ")}>
      {children}
    </button>
  );
};

const School = props => {
  console.log(props);
  const school = TEST_DATA.schools.find(school => school.id === props.id);

  if (!school) {
    return null;
  }

  return (
    <article className="max-w-4xl mx-auto mt-8 mb-16 px-8">
      <div className="flex items-center">
        <img
          src={school.logo}
          alt={`${school.name} school logo`}
          className="w-auto ml-auto h-24"
        />
        <div>
          <h1 className="font-bold text-5xl mb-2">{school.name}</h1>
        </div>
      </div>
    </article>
  );
};

const User = props => {
  console.log(props);
  const user = TEST_DATA.users.find(user => user.id === props.id);

  if (!user) {
    return null;
  }

  return (
    <article className="max-w-4xl mx-auto mt-8 mb-16 px-8">
      <div className="flex items-center">
        <img
          className="w-20 mr-8 rounded-full"
          src={user.picture}
          alt={`Avatar for ${user.name}`}
        />
        <div>
          <h1 className="font-bold text-5xl mb-2">{user.name}</h1>
        </div>
      </div>
    </article>
  );
};

const SchoolEvent = props => {
  console.log(props);
  const event = TEST_DATA.events.find(event => event.id === props.id);

  if (!event) {
    return null;
  }

  const school = TEST_DATA.schools.find(school => school.id === event.schoolId);

  return (
    <article className="max-w-4xl mx-auto mt-8 mb-16 px-8">
      <div className="flex items-center">
        <div>
          <Link
            to={`../../../${school.url}`}
            className={`${DEFAULT_LINK_CLASSNAMES} text-xl`}
          >
            {school.name}
          </Link>
          <h1 className="font-bold text-5xl mb-2">{event.title}</h1>
        </div>
        <img
          src={school.logo}
          alt={`${school.name} school logo`}
          className="w-auto ml-auto h-24"
        />
      </div>
      <div className="block pb-1 mt-4 text-2xl">
        <FontAwesomeIcon
          icon={faCalendar}
          className="text-gray-700 mr-2 text-xl"
        />
        <time dateTime={event.dateTime}>{event.formattedDateTime}</time>
      </div>
      <div className="block pb-2 text-2xl">
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          className="text-gray-700 mr-2 text-xl"
        />
        {event.address ? (
          <OutsideLink href={event.addressLink}>{event.address}</OutsideLink>
        ) : (
          <span>To be determined</span>
        )}
      </div>
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Event Details</h2>
        <p className="text-2xl pt-4">{event.description}</p>
        <h3 className="text-2xl font-bold pt-12">{event.going} people going</h3>
        <ul className="flex flex-wrap pt-4">
          {TEST_DATA.users.map(user => (
            <li key={user.id} className="w-1/3 md:w-1/4">
              <div className="flex flex-col items-center justify-around pt-6 pb-1 my-4 mr-4 bg-white border-4 rounded-lg">
                <img
                  className="w-20 rounded-full"
                  src={user.picture}
                  alt={`Avatar for ${user.name}`}
                />
                <Link
                  to={`../../../user/${user.id}`}
                  className={`${DEFAULT_LINK_CLASSNAMES} m-4 mt-8 leading-tight font-bold text-center`}
                >
                  {user.name}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

const truncate = (str, length = 100, ending = "...") => {
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};

export default App;
