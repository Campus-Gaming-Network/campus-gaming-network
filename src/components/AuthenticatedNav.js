import React from "react";
import { navigate } from "@reach/router";
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
/* eslint-disable no-unused-vars */
import SchoolLogo from "./SchoolLogo";

const AuthenticatedNav = () => {
  const state = useAppState();
  const [authenticatedUser] = useAuthState(firebaseAuth);
  const user = React.useMemo(
    () => (authenticatedUser ? state.users[authenticatedUser.uid] : {}),
    [authenticatedUser, state.users]
  );
  const school = React.useMemo(
    () =>
      user && user.school && user.school.id
        ? state.schools[user.school.id]
        : {},
    [user, state.schools]
  );
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    firebaseAuth.signOut().then(() => navigate("/"));
  };

  console.log("AuthenticatedNav", { user, school });

  return (
    <Flex
      as="nav"
      role="navigation"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      shadow="sm"
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
          to="/create-event"
          variantColor="purple"
          variant="ghost"
        >
          Create an event
        </Button>
      </Box>

      <Box
        display={{ sm: isMenuOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
        ml={2}
      >
        <Menu>
          <MenuButton
            d="flex"
            alignItems="center"
            justifyContent="center"
            _focus={{
              bg: "gray.100",
              boxShadow: "outline"
            }}
            _hover={{
              bg: "gray.100"
            }}
            px={4}
            rounded="md"
          >
            {user.gravatar ? (
              <Avatar
                name={user.fullName}
                src={user.gravatarUrl}
                alt={`The profile picture for ${user.fullName}`}
                title={`The profile picture for ${user.fullName}`}
                h={10}
                w={10}
                rounded="full"
                mr={4}
                bg="white"
                borderWidth={2}
                borderColor="gray.300"
                height="2.5rem"
              />
            ) : null}
            <Text fontWeight="bold" color="gray.900">
              {user.firstName}
            </Text>
          </MenuButton>

          <MenuList>
            <MenuItem as={ReachLink} to={`user/${user.id}`}>
              <Flex alignItems="center">
                {user.gravatar ? (
                  <Avatar
                    name={user.fullName}
                    src={user.gravatarUrl}
                    alt={`The profile picture for ${user.fullName}`}
                    title={`The profile picture for ${user.fullName}`}
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
            <MenuItem as={ReachLink} to={`school/${user.school.id}`}>
              {/* <SchoolLogo
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
              /> */}
              <Flex alignItems="center" color="gray.600" mr={2}>
                <FontAwesomeIcon icon={faSchool} />
              </Flex>
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
