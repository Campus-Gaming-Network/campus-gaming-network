import React from "react";
import Gravatar from "react-gravatar";
import {
  Button as ChakraButton,
  Box,
  Image,
  Flex,
  Text
} from "@chakra-ui/core";
import * as constants from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import { firebaseStorage } from "../firebase";

import Link from "./Link";

const Nav = props => {
  // const schoolId = props.school ? props.school.id : "";
  const [logoUrl, setLogoUrl] = React.useState(null);
  const UI = {
    Silhouette: props.appLoading,
    LoggedIn: props.isAuthenticated && !props.isLoadingUser
  };

  let NavContent;

  React.useEffect(() => {
    const fetchSchoolLogo = () => {
      const storageRef = firebaseStorage.ref();
      const pathRef = storageRef.child(
        `schools/${props.school.id}/images/logo.jpg`
      );
      pathRef.getDownloadURL().then(url => {
        setLogoUrl(url);
      });
    };

    if (props.school && props.school.id) {
      fetchSchoolLogo();
    }
  }, [props.school]);

  if (UI.Silhouette) {
    NavContent = (
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
    );
  } else if (UI.LoggedIn) {
    NavContent = (
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
          to={`school/${props.school.id}`}
          className="items-center flex mx-5 py-1 active:outline sm:rounded-none rounded hover:text-gray-300 hover:underline focus:underline"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${props.school.name} school logo`}
              h={12}
              w={12}
              bg="white"
              rounded="full"
              border="4px"
              borderColor="gray.300"
              mr={2}
            />
          ) : (
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
          )}
          <Text as="span" fontWeight="bold" color="gray.200" fontSize="xl">
            School
          </Text>
        </Link>
        <Link
          to={`user/${props.user.id}`}
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
    );
  } else {
    NavContent = (
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
    );
  }

  return (
    <nav
      role="navigation"
      className={`${
        props.isMenuOpen ? "block" : "hidden"
      } px-2 pt-2 pb-4 sm:flex items-center sm:p-0`}
    >
      {NavContent}
    </nav>
  );
};

export default Nav;
