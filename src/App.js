import React from "react";
import { Router, Link } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faMapMarkerAlt,
  faCalendar,
  faCalendarAlt,
  faUserFriends,
  faCheck,
  faStar,
  faLongArrowAltRight,
  faArrowRight,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as Logo } from "./logo.svg";
import "./App.css";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [isLoggedin, setIsLoggedIn] = React.useState(false);

  return (
    <React.Fragment>
      {/* Start Header */}
      <header className="bg-white border-b-2 sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3">
        <div className="flex items-center justify-between px-4 py-3 sm:p-0">
          <div className="flex items-center">
            <Link to="/">
              <Logo className="h-16 pr-4" />
            </Link>
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
        {!isLoggedin && (
          <nav
            role="navigation"
            className={`${
              isMenuOpen ? "block" : "hidden"
            } px-2 pt-2 pb-4 sm:flex sm:p-0`}
          >
            <Link
              to="/profile"
              className="block mx-2 py-1 active:outline font-medium sm:rounded-none rounded text-blue-700 hover:text-blue-800 hover:underline focus:underline"
            >
              Profile
            </Link>
            <a
              href="#"
              className="block mx-2 py-1 active:outline font-medium sm:rounded-none rounded text-blue-700 hover:text-blue-800 hover:underline focus:underline"
            >
              Log in
            </a>
            <a
              href="#"
              className="mt-1 block mx-2 py-1 font-medium sm:rounded-none rounded text-blue-700 hover:text-blue-800 hover:underline focus:underline sm:mt-0 sm:ml-2"
            >
              Sign up
            </a>
          </nav>
        )}
      </header>
      {/* End Header */}
      {/* Start Body */}
      <main className="pb-12">
        <Router>
          <Home path="/" />
          <Profile path="profile" />
        </Router>
      </main>
      <footer>
        <section className="max-w-4xl mx-auto p-8 flex items-center justify-around">
          <a
            href="#"
            className="font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline"
          >
            <FontAwesomeIcon />
            About
          </a>
          <a
            href="#"
            className="font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline"
          >
            <FontAwesomeIcon />
            Contribute
          </a>
          <a
            href="#"
            className="font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline"
          >
            <FontAwesomeIcon />
            Contact
          </a>
        </section>
      </footer>
      {/* End Body */}
    </React.Fragment>
  );
};

const Home = () => {
  const onSearchSubmit = e => {
    e.preventDefault();

    alert(e.target.search.value);
  };

  return (
    <React.Fragment>
      <h1 className="text-center text-5xl py-12">Campus Gaming Network</h1>
      <article>
        <section className="max-w-4xl mx-auto bg-white p-8 border-2 rounded flex items-center">
          <img
            className="h-40 pr-12"
            src="https://st2.depositphotos.com/3834629/5652/v/950/depositphotos_56527995-stock-illustration-gamer-boy.jpg"
            alt=""
          />
          <form onSubmit={onSearchSubmit} className="flex-auto">
            <label className="text-2xl font-semibold text-gray-900 mb-4 block">
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
      <article className="max-w-4xl mx-auto mt-12">
        <h3 className="text-2xl font-semibold text-gray-800">
          Upcoming events near Chicago, IL
        </h3>
        <section className="bg-white px-6 border-2 rounded mt-4">
          <ul>
            <li className="flex items-center py-8">
              <img
                src="https://theory.cs.uic.edu/images/uic.PNG"
                alt=""
                className="w-auto flex-initial h-20 pr-8"
              />
              <div className="flex-initial">
                <a
                  href=""
                  className="text-2xl font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:underline block"
                >
                  General Body Meeting
                </a>
                <div className="block pb-1">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-700 mr-2"
                  />
                  <time className="text-lg" dateTime="2009-11-13T20:00Z">
                    Sun, Oct 3, 5:00pm
                  </time>
                </div>
                <div className="block pb-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-gray-700 mr-2"
                  />
                  <a
                    href=""
                    className="font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline"
                  >
                    212 Northern Ave, Boston, MA 02210
                  </a>
                </div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Atque ullam blanditiis ut et ab delectus, inventore quos.
                  Totam nihil explicabo quibusdam laboriosam fugiat commodi quam
                  autem quaerat rem! Temporibus, aliquam!
                </p>
                <div className="pt-2">
                  <FontAwesomeIcon
                    icon={faUserFriends}
                    className="text-gray-700 mr-2"
                  />
                  <span>71 Going</span>
                </div>
                <div className="pt-8">
                  <button
                    type="button"
                    className="bg-white border-2 border-gray-400 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded"
                  >
                    Going
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="ml-2 text-gray-800"
                    />
                  </button>
                  <button
                    type="button"
                    className="bg-white border-2 border-gray-400 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 ml-4 rounded"
                  >
                    Interested
                    <FontAwesomeIcon
                      icon={faStar}
                      className="ml-2 text-gray-800"
                    />
                  </button>
                </div>
              </div>
            </li>
            <li className="flex items-center py-8 border-t-2">
              <img
                src="https://i.pinimg.com/originals/da/63/b5/da63b5fb77c701640556c489b755a241.png"
                alt=""
                className="w-auto flex-initial h-20 pr-8"
              />
              <div className="flex-initial">
                <a
                  href=""
                  className="text-2xl font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:underline block"
                >
                  CSGO and Mountain Dew
                </a>
                <div className="block pb-1">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-700 mr-2"
                  />
                  <time className="text-lg" dateTime="2009-11-13T20:00Z">
                    Sun, Oct 3, 5:00pm
                  </time>
                </div>
                <div className="block pb-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-gray-700 mr-2"
                  />
                  <span>To be determined</span>
                </div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Atque ullam blanditiis ut et ab delectus, inventore quos.
                </p>
                <div className="pt-2">
                  <FontAwesomeIcon
                    icon={faUserFriends}
                    className="text-gray-700 mr-2"
                  />
                  <span>4 Going</span>
                </div>
                <div className="pt-8">
                  <button
                    type="button"
                    className="bg-teal-100 border-2 border-teal-700 hover:bg-teal-200 text-teal-700 font-semibold py-2 px-4 rounded"
                  >
                    Going
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="ml-2 text-teal-800"
                    />
                  </button>
                  <button
                    type="button"
                    className="bg-white border-2 border-gray-400 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 ml-4 rounded"
                  >
                    Interested
                    <FontAwesomeIcon
                      icon={faStar}
                      className="ml-2 text-gray-800"
                    />
                  </button>
                </div>
              </div>
            </li>
            <li className="flex items-center py-8 border-t-2">
              <img
                src="http://content.sportslogos.net/logos/32/706/full/7639_illinois_fighting_illini-alternate-1989.png"
                alt=""
                className="w-auto flex-initial h-20 pr-8"
              />
              <div className="flex-initial">
                <a
                  href=""
                  className="text-2xl font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:underline block"
                >
                  LoL and Doritos
                </a>
                <div className="block pb-1">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-700 mr-2"
                  />
                  <time className="text-lg" dateTime="2009-11-13T20:00Z">
                    Sun, Oct 3, 5:00pm
                  </time>
                </div>
                <div className="block pb-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-gray-700 mr-2"
                  />
                  <a
                    href=""
                    className="font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline"
                  >
                    212 Northern Ave, Boston, MA 02210
                  </a>
                </div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Atque ullam blanditiis ut et ab delectus, inventore quos.
                  Totam nihil explicabo quibusdam laborio...
                </p>
                <div className="pt-2">
                  <FontAwesomeIcon
                    icon={faUserFriends}
                    className="text-gray-700 mr-2"
                  />
                  <span>23 Going</span>
                </div>
                <div className="pt-8">
                  <button
                    type="button"
                    className="bg-white border-2 border-gray-400 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded"
                  >
                    Going
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="ml-2 text-gray-800"
                    />
                  </button>
                  <button
                    type="button"
                    className="bg-yellow-100 border-2 border-yellow-500 hover:bg-yellow-200 text-yellow-900 font-semibold py-2 px-4 ml-4 rounded"
                  >
                    Interested
                    <FontAwesomeIcon
                      icon={faStar}
                      className="ml-2 text-yellow-800"
                    />
                  </button>
                </div>
              </div>
            </li>
            <li className="flex items-center py-4 border-t-2">
              <a
                href=""
                className="font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline"
              >
                See all upcoming events near Chicago, IL
              </a>
            </li>
          </ul>
        </section>
      </article>
      <article className="max-w-4xl mx-auto mt-12">
        <h3 className="text-2xl font-semibold text-gray-800">
          Upcoming events in the United States
        </h3>
        <section className="bg-white px-6 border-2 rounded mt-4">
          <ul>
            <li className="flex items-center py-8">
              <img
                src="https://theory.cs.uic.edu/images/uic.PNG"
                alt=""
                className="w-auto flex-initial h-20 pr-8"
              />
              <div className="flex-initial">
                <a
                  href=""
                  className="text-2xl font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:underline block"
                >
                  General Body Meeting
                </a>
                <div className="block pb-1">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-700 mr-2"
                  />
                  <time className="text-lg" dateTime="2009-11-13T20:00Z">
                    Sun, Oct 3
                  </time>
                </div>
                <div className="block pb-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-gray-700 mr-2"
                  />
                  <a
                    href=""
                    className="font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline"
                  >
                    212 Northern Ave, Boston, MA 02210
                  </a>
                </div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Atque ullam blanditiis ut et ab delectus, inventore quos.
                  Totam nihil explicabo quibusdam laboriosam fugiat commodi quam
                  autem quaerat rem! Temporibus, aliquam!
                </p>
                <div className="pt-2">
                  <FontAwesomeIcon
                    icon={faUserFriends}
                    className="text-gray-700 mr-2"
                  />
                  <span>71 Going</span>
                </div>
              </div>
            </li>
            <li className="flex items-center py-8 border-t-2">
              <img
                src="https://i.pinimg.com/originals/da/63/b5/da63b5fb77c701640556c489b755a241.png"
                alt=""
                className="w-auto flex-initial h-20 pr-8"
              />
              <div className="flex-initial">
                <a
                  href=""
                  className="text-2xl font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:underline block"
                >
                  CSGO and Mountain Dew
                </a>
                <div className="block pb-1">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-700 mr-2"
                  />
                  <time className="text-lg" dateTime="2009-11-13T20:00Z">
                    Sun, Oct 3, 5:00pm
                  </time>
                </div>
                <div className="block pb-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-gray-700 mr-2"
                  />
                  <span>To be determined</span>
                </div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Atque ullam blanditiis ut et ab delectus, inventore quos.
                </p>
                <div className="pt-2">
                  <FontAwesomeIcon
                    icon={faUserFriends}
                    className="text-gray-700 mr-2"
                  />
                  <span>4 Going</span>
                </div>
              </div>
            </li>
            <li className="flex items-center py-8 border-t-2">
              <img
                src="http://content.sportslogos.net/logos/32/706/full/7639_illinois_fighting_illini-alternate-1989.png"
                alt=""
                className="w-auto flex-initial h-20 pr-8"
              />
              <div className="flex-initial">
                <a
                  href=""
                  className="text-2xl font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:underline block"
                >
                  LoL and Doritos
                </a>
                <div className="block pb-1">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-700 mr-2"
                  />
                  <time className="text-lg" dateTime="2009-11-13T20:00Z">
                    Sun, Oct 3, 5:00pm
                  </time>
                </div>
                <div className="block pb-2">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-gray-700 mr-2"
                  />
                  <a
                    href=""
                    className="font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline"
                  >
                    212 Northern Ave, Boston, MA 02210
                  </a>
                </div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Atque ullam blanditiis ut et ab delectus, inventore quos.
                  Totam nihil explicabo quibusdam laborio...
                </p>
                <div className="pt-2">
                  <FontAwesomeIcon
                    icon={faUserFriends}
                    className="text-gray-700 mr-2"
                  />
                  <span>23 Going</span>
                </div>
              </div>
            </li>
            <li className="flex items-center py-4 border-t-2">
              <a
                href=""
                className="font-medium text-blue-700 hover:text-blue-800 hover:underline focus:underline"
              >
                See all upcoming events in the United States
              </a>
            </li>
          </ul>
        </section>
      </article>
    </React.Fragment>
  );
};

const Profile = () => {
  return <div>Profile</div>;
};

export default App;
