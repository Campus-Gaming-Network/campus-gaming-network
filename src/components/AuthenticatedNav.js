import React from "react";
import { Link as ReachLink, navigate } from "@reach/router";
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
  Avatar
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faBars,
  faTimes,
  faSchool
} from "@fortawesome/free-solid-svg-icons";
import { firebaseAuth } from "../firebase";
import { useAppState } from "../store";
import Nav from "./Nav";
import SchoolSearch from "./SchoolSearch";
import SchoolLogo from "./SchoolLogo";
import Logo from "./Logo";

const AuthenticatedNav = () => {
  const state = useAppState();
  const [authenticatedUser] = useAuthState(firebaseAuth);
  const user = React.useMemo(
    () =>
      authenticatedUser && state.users[authenticatedUser.uid]
        ? state.users[authenticatedUser.uid]
        : {},
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

  const onSchoolSelect = selectedSchool => {
    if (selectedSchool && selectedSchool.id) {
      navigate(`/school/${selectedSchool.id}`);
    }
  };

  return (
    <Nav>
      <Flex align="center" mr={5}>
        <Logo width="200px" />
      </Flex>

      <SchoolSearch
        id="siteSchoolSearch"
        name="siteSchoolSearch"
        onSelect={onSchoolSelect}
        clearInputOnSelect
      />

      <Box
        display="flex"
        width="auto"
        alignItems="center"
        flexGrow={1}
        justifyContent="flex-end"
      >
        <Button
          as={ReachLink}
          to="/create-event"
          colorScheme="brand"
          size="sm"
          mr={4}
        >
          Create an event
        </Button>

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
            px={2}
            rounded="md"
          >
            <Flex align="center">
              {user.gravatar ? (
                <Avatar
                  name={user.fullName}
                  src={user.gravatarUrl}
                  mr={2}
                  size="xs"
                />
              ) : null}
              <Text fontWeight="bold" color="gray.900">
                {user.firstName}
              </Text>
              <Box ml={2}>
                <ChevronDownIcon />
              </Box>
            </Flex>
          </MenuButton>

          <MenuList>
            <MenuItem as={ReachLink} to={`user/${user.id}`}>
              <Flex alignItems="center">
                {user.gravatar ? (
                  <Avatar
                    name={user.fullName}
                    src={user.gravatarUrl}
                    mr={2}
                    size="xs"
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
              <SchoolLogo
                schoolId={school.id}
                schoolName={school.name}
                h={6}
                w={6}
                mr={2}
                fallback={
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    color="gray.600"
                    h={6}
                    w={6}
                    mr={2}
                  >
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
    </Nav>
  );
};

export default AuthenticatedNav;
