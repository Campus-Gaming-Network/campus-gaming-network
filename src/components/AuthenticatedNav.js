import React from "react";
import { navigate } from "@reach/router";
import isEmpty from "lodash.isempty";
import isEqual from "lodash.isequal";
import Gravatar from "react-gravatar";
// eslint-disable-next-line no-unused-vars
import { Link as ReachLink } from "@reach/router";
import {
  Button as ChakraButton,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  MenuOptionGroup,
  MenuItemOption
} from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import * as constants from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSchool,
  faUserCircle,
  faSignOutAlt
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
  const [isMenuOpen] = React.useState(false);

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
    <nav
      role="navigation"
      className={`${
        isMenuOpen ? "block" : "hidden"
      } px-2 pt-2 pb-4 sm:flex items-center sm:p-0`}
    >
      {/* TODO: Remove when better spot is found */}
      {/* <ChakraButton onClick={handleLogout}>Log out</ChakraButton> */}
      <Link
        to="/event/create"
        className="leading-none text-xl mx-5 rounded font-semibold text-white hover:text-gray-100 bg-purple-700 py-2 px-3 hover:underline focus:underline"
      >
        Create an Event
      </Link>
      <Menu>
        <MenuButton as={ChakraButton} variantColor="transparent" size="lg">
          {user.gravatar ? (
            <Gravatar
              default={constants.GRAVATAR.DEFAULT}
              rating={constants.GRAVATAR.RA}
              md5={user.gravatar}
              className="h-12 w-12 rounded-full border-4 bg-white border-gray-300 mr-2"
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
                <Gravatar
                  default={constants.GRAVATAR.DEFAULT}
                  rating={constants.GRAVATAR.RA}
                  md5={user.gravatar}
                  className="h-6 w-6 rounded-full mr-2"
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
    </nav>
  );
};

export default AuthenticatedNav;
