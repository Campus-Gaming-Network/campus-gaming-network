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
  ],
  user: {
    username: "bsansone",
    firstName: "Brandon",
    lastName: "Sansone",
    hometown: "Wheaton, Illinois",
    major: "Information Technology & Management",
    minor: "",
    status: "Alumni",
    isVerifiedStudent: true,
    birthdate: "1994-01-25T00:00Z",
    school: {
      id: "1",
      name: "Illinois Institute of Technology",
      abbreviation: "iit"
    },
    bio:
      "Hockey fan, ninja, drummer, Mad Men fan and product designer. Performing at the crossroads of art and sustainability to save the world from bad design. My opinions belong to nobody but myself. ",
    gameAccounts: [
      {
        name: "Discord",
        value: "#bsansone123"
      },
      {
        name: "Steam",
        value: "DJ Windows XP"
      },
      {
        name: "PlayStation Network",
        value: "BSansone52"
      },
      {
        name: "Xbox Live",
        value: "xXDestroyerXx"
      },
      {
        name: "Battle.net",
        value: "Kieji#1674"
      }
    ],
    currentlyPlaying: [
      {
        name: "Terraria",
        coverId: "co1rbo"
      },
      {
        name: "World of Warcraft Classic",
        coverId: "co1trz"
      },
      {
        name: "League of Legends",
        coverId: "lxoumgqbbj3erxgq6a6l"
      }
    ],
    favoriteGames: [
      {
        name: "League of Legends",
        coverId: "lxoumgqbbj3erxgq6a6l"
      },
      {
        name: "Call of Duty 2",
        coverId: "hjfe6xe6k5oqprn8vnkz"
      },
      {
        name: "Red Dead Redemption",
        coverId: "co1q1e"
      },
      {
        name: "Age of Empires II: The Age of Kings",
        coverId: "co1t5t"
      },
      {
        name: "Super Smash Bros. Melee",
        coverId: "co1pxc"
      }
    ]
  }
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
          className="fixed hidden top-0 left-0 ml-4 mt-4 rounded-lg border-2 border-black py-2 px-4 font-semibold bg-white"
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
      <div className="max-w-4xl mx-auto mt-8 mb-16">
        {/* <Logo className="h-24 mr-4" /> */}
        <h1 className="logo text-6xl mb-2">Campus Gaming Network</h1>
        <h2 className="text-3xl text-gray-600">
          Connect with other collegiate gamers for casual or competitive gaming
          at your school or nearby.
        </h2>
      </div>
      <article className="max-w-4xl mx-auto mb-12">
        <h3 className="text-3xl font-semibold text-gray-700">
          Upcoming events near Chicago, IL
        </h3>
        <section className="bg-white px-6 border-4 rounded-lg mt-4">
          <ul>
            {TEST_DATA.eventList.map((event, i) => (
              <EventListItem
                key={event.url}
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

const VisuallyHidden = props => {
  return <span className="visually-hidden" {...props} />;
};

const User = props => {
  console.log(props);
  return (
    <article className="max-w-4xl mx-auto mt-8 mb-16 text-lg">
      <header className="flex items-center">
        <img
          className="h-auto w-40 rounded-full border-4 border-gray-300"
          src="https://randomuser.me/api/portraits/lego/8.jpg"
          alt=""
        />
        <section className="pl-12">
          <h1 className="text-4xl font-bold leading-none pb-4 flex items-center">
            {TEST_DATA.user.firstName}
            {TEST_DATA.user.lastName ? ` ${TEST_DATA.user.lastName}` : ""}
            {TEST_DATA.user.isVerifiedStudent && (
              <span className="text-base">
                <VisuallyHidden>User is a verified student</VisuallyHidden>
                <FontAwesomeIcon
                  className="ml-4 text-2xl text-blue-600"
                  icon={faStar}
                />
              </span>
            )}
          </h1>
          <h2 className="italic">
            {`${
              TEST_DATA.user.status === "Alumni"
                ? "Alumni of "
                : TEST_DATA.user.status === "Grad"
                ? "Graduate Student at "
                : `${TEST_DATA.user.status} at `
            }`}
            <Link
              to={`/schools/${TEST_DATA.user.school.abbreviation}`}
              className={DEFAULT_LINK_CLASSNAMES}
            >
              {TEST_DATA.user.school.name}
            </Link>
          </h2>
        </section>
      </header>
      <section className="pt-12">
        <VisuallyHidden>Biography</VisuallyHidden>
        <p className="pt-1">{TEST_DATA.user.bio}</p>
      </section>
      <section className="pt-12">
        <h4 className="font-bold uppercase text-sm pb-4">Information</h4>
        <dl className="flex flex-wrap w-full">
          {TEST_DATA.user.hometown && (
            <React.Fragment>
              <dt className="w-1/2">Hometown</dt>
              <dd className="w-1/2">{TEST_DATA.user.hometown}</dd>
            </React.Fragment>
          )}
          <dt className="w-1/2">Major</dt>
          {TEST_DATA.user.major ? (
            <dd className="w-1/2">{TEST_DATA.user.major}</dd>
          ) : (
            <dd className="w-1/2 text-gray-500">Nothing set</dd>
          )}
          <dt className="w-1/2">Minor</dt>
          {TEST_DATA.user.minor ? (
            <dd className="w-1/2">{TEST_DATA.user.minor}</dd>
          ) : (
            <dd className="w-1/2 text-gray-500">Nothing set</dd>
          )}
        </dl>
      </section>
      <section className="pt-12">
        <h4 className="font-bold uppercase text-sm pb-4">Game Accounts</h4>
        <dl className="flex flex-wrap w-full">
          {TEST_DATA.user.gameAccounts.map(account => (
            <React.Fragment key={account.name}>
              <dt className="w-1/2">{account.name}</dt>
              <dd className="w-1/2">{account.value}</dd>
            </React.Fragment>
          ))}
        </dl>
      </section>
      <section className="pt-12">
        <h4 className="font-bold uppercase text-sm pb-4">Events Attending</h4>
        <p className="text-gray-500">
          This user is currently not attending any upcoming events.
        </p>
      </section>
      <section className="pt-12">
        <h4 className="font-bold uppercase text-sm pb-4">Currently Playing</h4>
        <ul className=" flex flex-wrap">
          {TEST_DATA.user.currentlyPlaying.map(game => (
            <li key={game.name} className="w-1/5">
              <img
                className="rounded h-40 shadow-lg"
                src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`}
                alt={`The cover art for ${game.name}`}
              />
            </li>
          ))}
        </ul>
      </section>
      <section className="pt-12">
        <h4 className="font-bold uppercase text-sm pb-4">Favorite Games</h4>
        <ul className="flex flex-wrap">
          {TEST_DATA.user.favoriteGames.map(game => (
            <li key={game.name} className="w-1/5">
              <img
                className="rounded h-40 shadow-lg"
                src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.coverId}.jpg`}
                alt={`The cover art for ${game.name}`}
              />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default App;
