import React from "react";
import { navigate } from "@reach/router";
import isEmpty from "lodash.isempty";
import Gravatar from "react-gravatar";
import { Button as ChakraButton, Flex, Text } from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import * as constants from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
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

  const handleLogout = () => {
    firebaseAuth.signOut().then(() => navigate("/"));
  };

  React.useEffect(() => {
    const _user = state.users[authenticatedUser.uid];
    if (isEmpty(user) && _user) {
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
      {/* <ChakraButton onClick={props.handleLogout}>Log out</ChakraButton> */}
      <Link
        to="/event/create"
        className="leading-none text-xl mx-5 rounded font-bold text-gray-200 hover:text-gray-300 bg-purple-700 py-2 px-3 hover:underline focus:underline"
      >
        Create an Event
      </Link>
      <Link
        to={`school/${school.id}`}
        className="items-center flex mx-5 py-1 active:outline sm:rounded-none rounded hover:text-gray-300 hover:underline focus:underline"
      >
        <SchoolLogo
          schoolId={school.id}
          alt={`${school.name} school logo`}
          h={12}
          w={12}
          bg="white"
          rounded="full"
          border="4px"
          borderColor="gray.300"
          mr={2}
          fallback={
            <Flex
              alignItems="center"
              justifyContent="center"
              color="gray.100"
              h={12}
              w={12}
              bg="gray.400"
              rounded="full"
              border="4px"
              borderColor="gray.300"
              mr={2}
            >
              <FontAwesomeIcon icon={faSchool} />
            </Flex>
          }
        />
        <Text as="span" fontWeight="bold" color="gray.200" fontSize="xl">
          School
        </Text>
      </Link>
      <Link
        to={`user/${user.id}`}
        className="items-center text-xl flex mx-5 py-1 active:outline font-bold sm:rounded-none rounded text-gray-200 hover:text-gray-300 hover:underline focus:underline"
      >
        <Gravatar
          default={constants.GRAVATAR.DEFAULT}
          rating={constants.GRAVATAR.RA}
          md5={user.gravatar}
          className="h-12 w-12 rounded-full border-4 bg-white border-gray-300 mr-2"
        />
        Profile
      </Link>
    </nav>
  );
};

export default AuthenticatedNav;
