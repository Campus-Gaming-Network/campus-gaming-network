import React from "react";
import { navigate } from "@reach/router";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import { Link as ReachLink } from "@reach/router";
import {
  Button,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Box,
  Avatar,
  Heading
} from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faUserCircle,
  faSignOutAlt,
  faBars,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { firebaseAuth } from "../firebase";
import { useAppState } from "../store";
import Link from "./Link";
import SchoolLogo from "./SchoolLogo";

const AuthenticatedNav = () => {
  const state = useAppState();
  const [authenticatedUser] = useAuthState(firebaseAuth);
  const [user, setUser] = React.useState({});
  const [school, setSchool] = React.useState({});
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // eslint-disable-next-line no-unused-vars
  const handleLogout = () => {
    firebaseAuth.signOut().then(() => navigate("/"));
  };

  React.useEffect(() => {
    const _user = authenticatedUser ? state.users[authenticatedUser.uid] : {};
    if (!isEqual(user, _user)) {
      setUser(_user);
    }
  }, [authenticatedUser, state.users, user]);

  React.useEffect(() => {
    if (!isEmpty(user)) {
      const _school = state.schools[user.school.id];

      if (isEmpty(school) && _school) {
        setSchool(_school);
      }
    }
  }, [user, state.schools, school]);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      borderBottomWidth={2}
      bg="white"
    >
      <Flex align="center" mr={5}>
        <Link to="/">
          <Heading as="h1" size="lg">
            CGN
          </Heading>
        </Link>
      </Flex>

      <Box display={{ sm: "block", md: "none" }} onClick={toggleMenu}>
        <FontAwesomeIcon title="Menu" icon={isMenuOpen ? faTimes : faBars} />
      </Box>

      <Box
        display={{ sm: isMenuOpen ? "block" : "none", md: "flex" }}
        width={{ sm: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        justifyContent={{ sm: "flex-start", md: "flex-end" }}
      >
        <Button
          as={ReachLink}
          to="/event/create"
          variantColor="purple"
          shadow="md"
        >
          Create an Event
        </Button>
      </Box>

      <Box
        display={{ sm: isMenuOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <Menu>
          <MenuButton as={Button} variantColor="transparent" size="lg">
            {user.gravatar ? (
              <Avatar
                name={user.fullname}
                src={user.gravatarUrl}
                h={12}
                w={12}
                rounded="full"
                mr={2}
                bg="white"
                borderWidth={2}
                borderColor="gray.300"
              />
            ) : null}
            <Text fontWeight="bold" fontSize="xl" color="gray.900">
              {user.firstName}
            </Text>
          </MenuButton>

          <MenuList>
            <MenuItem as={ReachLink} to={`user/${user.id}`}>
              <Flex alignItems="center">
                {user.gravatar ? (
                  <Avatar
                    name={user.fullname}
                    src={user.gravatarUrl}
                    h={6}
                    w={6}
                    rounded="full"
                    mr={2}
                  />
                ) : (
                  <Flex alignItems="center" color="gray.600" mr={2}>
                    <FontAwesomeIcon icon={faUserCircle} />
                  </Flex>
                )}
                <Text lineHeight="1">Profile</Text>
              </Flex>
            </MenuItem>
            <MenuItem as={ReachLink} to={`school/${school.id}`}>
              <SchoolLogo
                schoolId={school.id}
                alt={`${school.name} school logo`}
                h={6}
                w={6}
                bg="white"
                rounded="full"
                mr={2}
                fallback={
                  <Flex alignItems="center" color="gray.600" mr={2}>
                    <FontAwesomeIcon icon={faSchool} />
                  </Flex>
                }
              />
              <Text lineHeight="1">School</Text>
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleLogout}>
              <Flex alignItems="center">
                <Flex alignItems="center" color="gray.600" mr={2}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </Flex>
                <Text lineHeight="1">Log out</Text>
              </Flex>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default AuthenticatedNav;
