// Libraries
import React from "react";
import { Router } from "@reach/router";
import { useAuthState } from "react-firebase-hooks/auth";
import isEmpty from "lodash.isempty";
import {
  Box,
  Link as ChakraLink,
  List,
  ListItem,
  Text,
  Flex
} from "@chakra-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faMugHot,
  faExternalLinkAlt
} from "@fortawesome/free-solid-svg-icons";
// Other
import { firebaseAuth } from "./firebase";
import { useAppState, useAppDispatch, ACTION_TYPES } from "./store";

// Hooks
import useFetchUserDetails from "./hooks/useFetchUserDetails";
import useFetchSchoolDetails from "./hooks/useFetchSchoolDetails";

// Pages
import Home from "./pages";
import School from "./pages/school";
import User from "./pages/user";
import Event from "./pages/event";
import EditUser from "./pages/edit-user";
import EditSchool from "./pages/edit-school";
import CreateEvent from "./pages/create-event";
import NotFound from "./pages/not-found";

// Components
import AuthenticatedNav from "./components/AuthenticatedNav";
import ScrollToTop from "./components/ScrollToTop";
import NavSilhouette from "./components/NavSilhouette";
import FormSilhouette from "./components/FormSilhouette";
import UserSilhouette from "./components/UserSilhouette";
import SchoolSilhouette from "./components/SchoolSilhouette";
import EventSilhouette from "./components/EventSilhouette";
import Empty from "./components/Empty";
import Link from "./components/Link";
import OutsideLink from "./components/OutsideLink";

const AuthenticatedApp = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [authenticatedUser, isAuthenticating] = useAuthState(firebaseAuth);
  const [user, isFetchingUser] = useFetchUserDetails(
    authenticatedUser ? authenticatedUser.uid : null
  );
  const [school, isFetchingSchool] = useFetchSchoolDetails(
    user ? user.school.id : null
  );
  const isLoadingAuthenticatedUserData = React.useMemo(
    () => isEmpty(state.user) || isAuthenticating || isFetchingUser,
    [state.user, isAuthenticating, isFetchingUser]
  );
  const isLoadingAuthenticatedUserSchoolData = React.useMemo(
    () => isEmpty(state.school) || isAuthenticating || isFetchingSchool,
    [state.school, isAuthenticating, isFetchingSchool]
  );
  const shouldSetAuthenticatedUser = React.useMemo(
    () => !!user && isEmpty(state.user),
    [user, state.user]
  );
  const shouldSetAuthenticatedUserSchool = React.useMemo(
    () => !!school && isEmpty(state.school),
    [school, state.school]
  );
  const isReady = React.useMemo(
    () =>
      !isLoadingAuthenticatedUserData && !isLoadingAuthenticatedUserSchoolData,
    [isLoadingAuthenticatedUserData, isLoadingAuthenticatedUserSchoolData]
  );
  const [nav, setNav] = React.useState(<NavSilhouette />);
  const [routes, setRoutes] = React.useState(<SilhouetteRoutes />);

  React.useEffect(() => {
    if (shouldSetAuthenticatedUser) {
      dispatch({
        type: ACTION_TYPES.SET_USER,
        payload: user
      });
    }
  }, [dispatch, shouldSetAuthenticatedUser, user]);

  React.useEffect(() => {
    if (shouldSetAuthenticatedUserSchool) {
      dispatch({
        type: ACTION_TYPES.SET_SCHOOL,
        payload: school
      });
    }
  }, [dispatch, shouldSetAuthenticatedUserSchool, school]);

  React.useEffect(() => {
    if (isReady) {
      setNav(<AuthenticatedNav />);
      setRoutes(<Routes />);
    }
  }, [isReady]);

  return (
    <React.Fragment>
      {nav}
      <Box as="main" pb={12}>
        {routes}
      </Box>
      <Box
        as="footer"
        borderTopWidth={1}
        textAlign="center"
        pt={{ md: 8, sm: 0 }}
        pb={8}
      >
        <Flex justifyContent="space-between" flexWrap="wrap">
          <List
            spacing={2}
            flexBasis={{ md: "33.3333%", sm: "100%" }}
            minWidth={{ md: "33.3333%", sm: "100%" }}
            flexGrow={0}
            pt={{ md: 0, sm: 8 }}
          >
            <ListItem fontSize="xs" fontWeight="bold" textTransform="uppercase">
              Resources
            </ListItem>
            <ListItem fontSize="sm">
              <Link to="/about-us" color="purple.500" fontWeight={600}>
                About us
              </Link>
            </ListItem>
            <ListItem fontSize="sm">
              <Link
                to="/frequently-asked-questions"
                color="purple.500"
                fontWeight={600}
              >
                <Text as="abbr" title="Frequently asked questions">
                  FAQ
                </Text>
              </Link>
            </ListItem>
            <ListItem fontSize="sm">
              <ChakraLink
                href="mailto:support@campusgamingnetwork.com"
                color="purple.500"
                fontWeight={600}
              >
                Email us
              </ChakraLink>
            </ListItem>
          </List>
          <List
            spacing={2}
            flexBasis={{ md: "33.3333%", sm: "100%" }}
            minWidth={{ md: "33.3333%", sm: "100%" }}
            flexGrow={0}
            pt={{ md: 0, sm: 8 }}
          >
            <ListItem fontSize="xs" fontWeight="bold" textTransform="uppercase">
              Community
            </ListItem>
            <ListItem fontSize="sm">
              Join our{" "}
              <OutsideLink href="https://discord.gg/dpYU6TY" color="purple.500">
                Discord
                <Text as="span" ml={1}>
                  <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                </Text>
              </OutsideLink>
            </ListItem>
            <ListItem fontSize="sm">
              Contribute on{" "}
              <OutsideLink
                href="https://github.com/bsansone/campus-gaming-network"
                color="purple.500"
                fontWeight={600}
              >
                GitHub
                <Text as="span" ml={1}>
                  <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                </Text>
              </OutsideLink>
            </ListItem>
          </List>
          <List
            spacing={2}
            flexBasis={{ md: "33.3333%", sm: "100%" }}
            minWidth={{ md: "33.3333%", sm: "100%" }}
            flexGrow={0}
            pt={{ md: 0, sm: 8 }}
          >
            <ListItem fontSize="sm">
              Made with{" "}
              <Text d="inline" color="red.500">
                <FontAwesomeIcon icon={faHeart} />
              </Text>{" "}
              and <FontAwesomeIcon icon={faMugHot} /> in{" "}
              <Text d="inline" fontWeight={600}>
                Salt Lake City, Utah
              </Text>
            </ListItem>
            <ListItem fontSize="sm">
              Enjoying the site?{" "}
              <OutsideLink
                href="https://www.buymeacoffee.com/cgnbrandon"
                color="purple.500"
                fontWeight={600}
              >
                Buy me a coffee.
                <Text as="span" ml={1}>
                  <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                </Text>
              </OutsideLink>
            </ListItem>
          </List>
        </Flex>
      </Box>
    </React.Fragment>
  );
};

const SilhouetteRoutes = () => {
  return (
    <Router>
      <ScrollToTop default>
        <Empty path="/" />
        <FormSilhouette path="edit-user" />
        <UserSilhouette path="user/:id" />
        <SchoolSilhouette path="school/:id" />
        <FormSilhouette path="school/:id/edit" />
        <FormSilhouette path="create-event" />
        <EventSilhouette path="event/:id" />
        <FormSilhouette path="event/:id/edit" />
        <NotFound default />
      </ScrollToTop>
    </Router>
  );
};

const Routes = () => {
  return (
    <Router>
      <ScrollToTop default>
        <Home path="/" />
        <EditUser path="edit-user" />
        <User path="user/:id" />
        <School path="school/:id" />
        <EditSchool path="school/:id/edit" />
        <CreateEvent path="create-event" />
        <Event path="event/:id" />
        <CreateEvent path="event/:id/edit" edit={true} />
        <NotFound default />
      </ScrollToTop>
    </Router>
  );
};

export default AuthenticatedApp;
