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
  eventList: [
    {
      title: "General Body Meeting",
      url: "uic/events/1",
      logo: "https://theory.cs.uic.edu/images/uic.PNG",
      dateTime: "2009-11-13T20:00Z",
      formattedDateTime: "Sun, Oct 3, 5:00pm",
      addressLink: "https://goo.gl/maps/hRWzpokHjpgQaon78",
      address: "212 Northern Ave, Boston, MA 02210",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque ullam blanditiis ut et ab delectus, inventore quos. Totam nihil explicabo quibusdam laboriosam fugiat commodi quam autem quaerat rem! Temporibus, aliquam!",
      going: "71"
    },
    {
      title: "CSGO and Mountain Dew",
      url: "iit/events/1",
      logo:
        "https://i.pinimg.com/originals/da/63/b5/da63b5fb77c701640556c489b755a241.png",
      dateTime: "2009-11-13T20:00Z",
      formattedDateTime: "Sun, Oct 3, 5:00pm",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque ullam blanditiis ut et ab delectus, inventore quos.",
      going: "4",
      response: "yes"
    },
    {
      title: "LoL and Doritos",
      url: "uiuc/events/1",
      logo:
        "http://content.sportslogos.net/logos/32/706/full/7639_illinois_fighting_illini-alternate-1989.png",
      dateTime: "2009-11-13T20:00Z",
      formattedDateTime: "Sun, Oct 3, 5:00pm",
      addressLink: "https://goo.gl/maps/hRWzpokHjpgQaon78",
      address: "212 Northern Ave, Boston, MA 02210",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque ullam blanditiis ut et ab delectus, inventore quos. Totam nihil explicabo quibusdam laborio...",
      going: "23",
      response: "maybe"
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
          {isLoggedIn && <User path="user/:id" {...authProps} />}
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
  const onSearchSubmit = e => {
    e.preventDefault();

    alert(e.target.search.value);
  };

  return (
    <React.Fragment>
      <div className="max-w-4xl mx-auto mt-8 mb-16">
        {/* <Logo className="h-24 mr-4" /> */}
        <h1 className="text-6xl mb-2">Campus Gaming Network</h1>
        <h2 className="text-3xl text-gray-600">
          Connect with other collegiate gamers for casual or competitive gaming
          at your school or nearby.
        </h2>
      </div>
      <article className="hidden">
        <section className="max-w-4xl mx-auto bg-white p-8 border-2 rounded-lg flex items-center">
          <img
            className="h-40 pr-12"
            src="https://st2.depositphotos.com/3834629/5652/v/950/depositphotos_56527995-stock-illustration-gamer-boy.jpg"
            alt=""
          />
          <form onSubmit={onSearchSubmit} className="flex-auto">
            <label className="text-4xl font-semibold text-gray-900 mb-4 block">
              Find your next gaming party:
            </label>
            <div className="flex">
              <input
                id="search"
                name="search"
                type="text"
                placeholder="Search for a game or school"
                className="border-2 border-r-0 rounded-l w-full py-2 pl-3 text-gray-700"
              />
              <button
                type="submit"
                className="bg-white border-2 border-gray-400 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-r"
              >
                Search
              </button>
            </div>
          </form>
        </section>
      </article>
      <article className="max-w-4xl mx-auto mb-12">
        <h3 className="text-3xl font-semibold text-gray-700">
          Upcoming events near Chicago, IL
        </h3>
        <section className="bg-white px-6 border-4 rounded-lg mt-4">
          <ul>
            {TEST_DATA.eventList.map((event, i) => (
              <EventListItem
                isFirst={i === 0}
                isLoggedIn={props.isLoggedIn}
                {...event}
              />
            ))}
            <li className="flex items-center py-4 border-t-4 text-lg">
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

  return (
    <li
      className={`flex items-center py-8 ${!props.isFirst ? "border-t-4" : ""}`}
    >
      <img src={props.logo} alt="" className="w-auto flex-initial h-20 pr-8" />
      <div className="flex-initial">
        <Link
          to={props.url}
          className="text-3xl font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:underline block"
        >
          {props.title}
        </Link>
        <div className="block pb-1">
          <FontAwesomeIcon icon={faCalendar} className="text-gray-700 mr-2" />
          <time className="text-lg" dateTime={props.dateTime}>
            {props.formattedDateTime}
          </time>
        </div>
        <div className="block pb-2">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="text-gray-700 mr-2"
          />
          {props.address ? (
            <OutsideLink href={props.addressLink}>{props.address}</OutsideLink>
          ) : (
            <span>To be determined</span>
          )}
        </div>
        <p className="text-lg">{props.description}</p>
        <div className="pt-2">
          <FontAwesomeIcon
            icon={faUserFriends}
            className="text-gray-700 mr-2"
          />
          <span>{props.going} Going</span>
        </div>
        {props.isLoggedIn && (
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

const OutsideLink = ({ children, ...rest }) => {
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

const User = props => {
  console.log(props);
  return <article className="max-w-4xl mx-auto mt-8 mb-16">User</article>;
};

export default App;
