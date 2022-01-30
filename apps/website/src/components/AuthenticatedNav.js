// Libraries
import React from "react";
import { useRouter } from "next/router";
import {
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Box,
  Avatar,
  Tooltip,
  Stack,
  MenuGroup,
  useBoolean,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSchool,
  faPlus,
  faTrophy,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { signOut } from "firebase/auth";

// Components
import NavWrapper from "src/components/NavWrapper";
import SchoolSearch from "src/components/SchoolSearch";
import SchoolLogo from "src/components/SchoolLogo";
import Logo from "src/components/Logo";
import Link from "src/components/Link";
import ButtonLink from "src/components/ButtonLink";

// Other
import { auth } from "src/firebase";

// Providers
import { useAuth } from "src/providers/auth";

////////////////////////////////////////////////////////////////////////////////
// AuthenticatedNav

const AuthenticatedNav = (props) => {
  const { authUser } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useBoolean();

  const handleLogout = () => {
    signOut(auth).then(() => router.push("/"));
  };

  const onSchoolSelect = (selectedSchool) => {
    if (selectedSchool && selectedSchool.handle) {
      router.push(`/school/${selectedSchool.handle}`);
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
        withOverlay
      />

      <Flex
        width="auto"
        alignItems="center"
        flexGrow={{ base: 0, md: 1 }}
        justifyContent={{ base: "flex-start", md: "flex-end" }}
      >
        <Menu>
          <Tooltip
            label="Creation is disabled until email is verified."
            isDisabled={authUser.emailVerified}
          >
            <MenuButton
              as={Button}
              isDisabled={!authUser.emailVerified}
              leftIcon={<FontAwesomeIcon icon={faPlus} />}
              colorScheme="brand"
              h="32px"
              mr={2}
            >
              Create
            </MenuButton>
          </Tooltip>
          <MenuList>
            <MenuGroup title="Create" fontSize="xl" fontWeight={800}>
              <MenuItem
                as={Link}
                href="/create-event"
                icon={
                  <Flex
                    align="center"
                    justify="center"
                    bg="gray.200"
                    rounded="full"
                    p={2}
                    fontSize="lg"
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </Flex>
                }
              >
                <Text fontWeight={600}>Event</Text>
                <Text>Bring collegiate gamers together.</Text>
              </MenuItem>
              <MenuItem
                as={Link}
                href="/create-tournament"
                isDisabled
                icon={
                  <Flex
                    align="center"
                    justify="center"
                    bg="gray.200"
                    rounded="full"
                    p={2}
                    fontSize="lg"
                  >
                    <FontAwesomeIcon icon={faTrophy} />
                  </Flex>
                }
              >
                <Text fontWeight={600}>Tournament</Text>
                <Text>Coming soon!</Text>
              </MenuItem>
              <MenuItem
                as={Link}
                href="/create-team"
                icon={
                  <Flex
                    align="center"
                    justify="center"
                    bg="gray.200"
                    rounded="full"
                    p={2}
                    fontSize="lg"
                  >
                    <FontAwesomeIcon icon={faUserFriends} />
                  </Flex>
                }
              >
                <Text fontWeight={600}>Team</Text>
                <Text>Coming soon!</Text>
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            d="flex"
            alignItems="center"
            justifyContent="center"
            _focus={{
              bg: "gray.900",
              boxShadow: "outline",
            }}
            _hover={{
              bg: "gray.900",
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
                  title={props.user.fullName}
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
            <MenuGroup title={props.user.fullName}>
              <MenuItem as={Link} href={`/user/${props.user.id}`}>
                <Flex alignItems="center">
                  {Boolean(props.user.gravatar) ? (
                    <Avatar
                      name={props.user.fullName}
                      title={props.user.fullName}
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
              <MenuItem as={Link} href={`/school/${props.school.handle}`}>
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
              <MenuItem as={Link} href="/teams">
                <Flex alignItems="center">
                  <Flex alignItems="center" color="gray.600" mr={3}>
                    <FontAwesomeIcon icon={faUserFriends} />
                  </Flex>
                  <Text lineHeight="1">Teams</Text>
                </Flex>
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Settings">
              <MenuItem as={Link} href={"/edit-user"}>
                Edit Profile
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuItem onClick={handleLogout}>
              <Text lineHeight="1">Log out</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </NavWrapper>
  );
};

export default AuthenticatedNav;
