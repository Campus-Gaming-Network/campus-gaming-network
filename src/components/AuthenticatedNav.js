import React from "react";
import { useRouter } from "next/router";
import {
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Box,
  Avatar,
  Tooltip,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faSchool
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import NavWrapper from "src/components/NavWrapper";
import SchoolSearch from "src/components/SchoolSearch";
import SchoolLogo from "src/components/SchoolLogo";
import Logo from "src/components/Logo";
import Link from "src/components/Link";
import ButtonLink from "src/components/ButtonLink";

// Other
import firebase from "src/firebase";

// Providers
import { useAuth } from "src/providers/auth";

const AuthenticatedNav = props => {
  const { authUser } = useAuth();
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
        <Logo htmlHeight="35px" htmlWidth="115px" p={1} />
      </Flex>

      <SchoolSearch
        id="siteSchoolSearch"
        name="siteSchoolSearch"
        onSelect={onSchoolSelect}
        clearInputOnSelect
      />

      <Flex
        width="auto"
        alignItems="center"
        flexGrow={{ base: 0, md: 1 }}
        justifyContent={{ base: "flex-start", md: "flex-end" }}
      >
        <ButtonLink
          href="/create-event"
          colorScheme="brand"
          size="sm"
          mr={4}
          disabled={!authUser.emailVerified}
        >
          <Tooltip
            label="Event creation is disabled until email is verified."
            isDisabled={authUser.emailVerified}
          >
            <Flex align="center" justify="center">
              <Box mr={2}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </Box>
              <Text>Create event</Text>
            </Flex>
          </Tooltip>
        </ButtonLink>

        <Menu>
          <MenuButton
            d="flex"
            alignItems="center"
            justifyContent="center"
            _focus={{
              bg: "gray.900",
              boxShadow: "outline"
            }}
            _hover={{
              bg: "gray.900"
            }}
            px={2}
            rounded="md"
            height="32px"
            color="gray.200"
          >
            <Flex align="center">
              {Boolean(props.user.gravatar) ? (
                <Avatar
                  name={props.user.fullName}
                  src={props.user.gravatarUrl}
                  mr={2}
                  size="xs"
                />
              ) : null}
              <Text fontWeight="bold">{props.user.firstName}</Text>
              <Box ml={2}>
                <ChevronDownIcon />
              </Box>
            </Flex>
          </MenuButton>

          <MenuList>
            <MenuItem as={Link} href={`/user/${props.user.id}`}>
              <Flex alignItems="center">
                {Boolean(props.user.gravatar) ? (
                  <Avatar
                    name={props.user.fullName}
                    src={props.user.gravatarUrl}
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
            <MenuItem as={Link} href={`/school/${props.school.id}`}>
              <SchoolLogo
                schoolId={props.school.id}
                schoolName={props.school.formattedName}
                h={6}
                w={6}
                htmlHeight={6}
                htmlWidth={6}
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
      </Flex>
    </NavWrapper>
  );
};

export default AuthenticatedNav;
