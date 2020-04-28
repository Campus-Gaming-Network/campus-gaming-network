import React from "react";
import Gravatar from "react-gravatar";
import { Button as ChakraButton, Box } from "@chakra-ui/core";
import * as constants from "../constants";

import Link from "./Link";

const Nav = props => {
  return (
    <nav
      role="navigation"
      className={`${
        props.isMenuOpen ? "block" : "hidden"
      } px-2 pt-2 pb-4 sm:flex items-center sm:p-0`}
    >
      {props.appLoading ? (
        <React.Fragment>
          <Box bg="purple.500" w="135px" h="28px" mx="5" borderRadius="md" />
          <Box
            bg="gray.200"
            w="48px"
            h="48px"
            ml="5"
            mr="2"
            my="1"
            borderRadius="full"
          />
          <Box bg="purple.500" w="70px" h="28px" mr="5" borderRadius="md" />
          <Box
            bg="gray.200"
            w="48px"
            h="48px"
            ml="5"
            mr="2"
            my="1"
            borderRadius="full"
          />
          <Box bg="purple.500" w="70px" h="28px" mr="5" borderRadius="md" />
        </React.Fragment>
      ) : props.isAuthenticated && !props.isLoadingUser ? (
        <React.Fragment>
          {/* TODO: Remove when better spot is found */}
          {/* <ChakraButton onClick={props.handleLogout}>Log out</ChakraButton> */}
          <Link
            to="/event/create"
            className="leading-none text-xl mx-5 rounded font-bold text-gray-200 hover:text-gray-300 bg-purple-700 py-2 px-3 hover:underline focus:underline"
          >
            Create an Event
          </Link>
          <Link
            to={`school/${props.school.ref.id}`}
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
            to={`user/${props.user.ref.id}`}
            className="items-center text-xl flex mx-5 py-1 active:outline font-bold sm:rounded-none rounded text-gray-200 hover:text-gray-300 hover:underline focus:underline"
          >
            <Gravatar
              default={constants.GRAVATAR.DEFAULT}
              rating={constants.GRAVATAR.RA}
              md5={props.user ? props.user.gravatar : null}
              className="h-12 w-12 rounded-full border-4 bg-white border-gray-300 mr-2"
            />
            Profile
          </Link>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Link
            to="/login"
            className="text-xl block mx-3 py-1 active:outline sm:rounded text-gray-200 hover:text-gray-300 hover:underline focus:underline"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="text-xl mt-1 block mx-3 rounded font-bold text-gray-200 hover:text-gray-300 bg-purple-700 py-1 px-3 hover:underline focus:underline sm:mt-0 sm:ml-2"
          >
            Sign Up Free
          </Link>
        </React.Fragment>
      )}
    </nav>
  );
};

export default Nav;
