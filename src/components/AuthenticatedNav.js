import React from "react";
import { navigate } from "@reach/router";
import Gravatar from "react-gravatar";
import { Button as ChakraButton, Image, Flex, Text } from "@chakra-ui/core";
import * as constants from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import { firebaseStorage, firebaseAuth } from "../firebase";
import { useAppState } from "../store";

import Link from "./Link";

const AuthenticatedNav = () => {
  const state = useAppState();
  // const schoolId = state.school ? state.school.id : "";
  const [logoUrl, setLogoUrl] = React.useState(null);
  const [isMenuOpen] = React.useState(false);

  const handleLogout = () => {
    firebaseAuth.signOut().then(() => navigate("/"));
  };

  React.useEffect(() => {
    const fetchSchoolLogo = () => {
      const storageRef = firebaseStorage.ref();
      const pathRef = storageRef.child(
        `schools/${state.school.id}/images/logo.jpg`
      );
      pathRef.getDownloadURL().then(url => {
        setLogoUrl(url);
      });
    };

    if (state.school && state.school.id) {
      fetchSchoolLogo();
    }
  }, [state.school]);

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
        to={`school/${state.school.id}`}
        className="items-center flex mx-5 py-1 active:outline sm:rounded-none rounded hover:text-gray-300 hover:underline focus:underline"
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${state.school.name} school logo`}
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
        to={`user/${state.user.id}`}
        className="items-center text-xl flex mx-5 py-1 active:outline font-bold sm:rounded-none rounded text-gray-200 hover:text-gray-300 hover:underline focus:underline"
      >
        <Gravatar
          default={constants.GRAVATAR.DEFAULT}
          rating={constants.GRAVATAR.RA}
          md5={state.user.gravatar}
          className="h-12 w-12 rounded-full border-4 bg-white border-gray-300 mr-2"
        />
        Profile
      </Link>
    </nav>
  );
};

export default AuthenticatedNav;
