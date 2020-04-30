import React from "react";
import { Router, navigate } from "@reach/router";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";
import "@reach/skip-nav/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faHome } from "@fortawesome/free-solid-svg-icons";
// TODO: Replace moment with something smaller
import moment from "moment";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import momentLocalizer from "react-widgets-moment";
import "react-widgets/dist/css/react-widgets.css";
import "./App.css";
import { firebase, firebaseAuth, firebaseFirestore } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import sortBy from "lodash.sortby";

// Pages
import Home from "./pages";
import School from "./pages/school";
import Signup from "./pages/signup";
import Login from "./pages/login";
// TODO: Reimplement with firebase
// import ForgotPassword from "./pages/forgot-password";
import User from "./pages/user";
import Event from "./pages/event";
import EditUser from "./pages/edit-user";
import EditSchool from "./pages/edit-school";
import CreateEvent from "./pages/create-event";
import NotFound from "./pages/not-found";

// Components
import Link from "./components/Link";
import Flex from "./components/Flex";
import Nav from "./components/Nav";
import ScrollToTop from "./components/ScrollToTop";

// Hooks
import useFetchUserSchool from "./hooks/useFetchUserSchool";
import useFetchUserDetails from "./hooks/useFetchUserDetails";
import useLocalStorage from "./hooks/useLocalStorage";

moment.locale("en");
momentLocalizer();

firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

////////////////////////////////////////////////////////////////////////////////
// App

const App = () => {
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const isAuthenticated = !!authenticatedUser;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [user, isLoadingUserDetails] = useFetchUserDetails(
    authenticatedUser ? authenticatedUser.uid : null
  );
  const [school, isLoadingUserSchool] = useFetchUserSchool(user);
  const [shouldFetchSchools, setShouldFetchSchools] = React.useState(false);
  const [schools, setSchools] = useLocalStorage("cgn-schools", null);

  React.useEffect(() => {
    const fetchSchools = async () => {
      firebaseFirestore
        .collection("schools")
        .get()
        .then(snapshot => {
          setSchools(
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

    fetchSchools();
  }, [shouldFetchSchools]);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function handleLogout() {
    firebaseAuth.signOut().then(() => navigate("/"));
  }

  const isLoadingUser =
    isLoadingUserDetails ||
    isLoadingUserSchool ||
    (isAuthenticated && !school && !user);

  const appProps = {
    appLoading: isAuthenticating || isLoadingUser,
    isAuthenticating,
    isAuthenticated,
    isLoadingUser,
    authenticatedUser,
    user,
    school,
    handleLogout,
    isMenuOpen,
    setIsMenuOpen
  };

  if (!schools && !shouldFetchSchools) {
    setShouldFetchSchools(true);
  }

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
            {/* TODO: Reimplement  with firebase */}
            {/* <ForgotPassword path="forgot-password" {...appProps} /> */}
            <NotFound default />
          </ScrollToTop>
        </Router>
      </main>
      {/* TODO: When we have actual content here */}
      {/* <footer className="bg-gray-200 text-lg border-t-2 border-gray-300">
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
      </footer> */}
    </ThemeProvider>
  );
};

export default App;
