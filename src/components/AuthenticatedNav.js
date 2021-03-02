import React from "react";
import { useRouter } from "next/router";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faBars,
  faTimes,
  faSchool
} from "@fortawesome/free-solid-svg-icons";
import NavWrapper from "src/components/NavWrapper";
import SchoolSearch from "src/components/SchoolSearch";
import SchoolLogo from "src/components/SchoolLogo";
import Logo from "src/components/Logo";
import Link from "src/components/Link";
import ButtonLink from "src/components/ButtonLink";

// Other
import firebase from "src/firebase";

const AuthenticatedNav = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => router.push("/"));
  };

  const onSchoolSelect = selectedSchool => {
    const id = selectedSchool.id || selectedSchool.objectID;

    if (selectedSchool && id) {
      router.push(`/school/${id}`);
    }
  };

  return (
    <NavWrapper>
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
        <ButtonLink href="/create-event" colorScheme="brand" size="sm" mr={4}>
          Create an event
        </ButtonLink>

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
            <MenuItem as={Link} href={`user/${user.id}`}>
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
            <MenuItem as={Link} href={`school/${user.school.id}`}>
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
    </NavWrapper>
  );
};

export default AuthenticatedNav;
