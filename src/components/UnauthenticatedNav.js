import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Link as ReachLink, navigate } from "@reach/router";

// Components
import Link from "./Link";
import SchoolSearch from "./SchoolSearch";
import VisuallyHidden from "./VisuallyHidden";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onSchoolSelect = selectedSchool => {
    if (selectedSchool && selectedSchool.id) {
      navigate(`/school/${selectedSchool.id}`);
    }
  };

  return (
    <Flex
      as="nav"
      role="navigation"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      borderBottomWidth={2}
      bg="white"
    >
      <Flex align="center" mr={5}>
        <Link to="/">
          <VisuallyHidden>
            <Heading as="h1" size="lg">
              Campus Gaming Network
            </Heading>
          </VisuallyHidden>
        </Link>
      </Flex>

      <SchoolSearch
        id="siteSchoolSearch"
        name="siteSchoolSearch"
        onSelect={onSchoolSelect}
        clearInputOnSelect
      />

      <Box
        display={{ xs: "block", sm: "block", md: "none" }}
        onClick={toggleMenu}
      >
        <FontAwesomeIcon title="Menu" icon={isMenuOpen ? faTimes : faBars} />
      </Box>

      <Box
        display={{
          xs: isMenuOpen ? "block" : "none",
          sm: isMenuOpen ? "block" : "none",
          md: "flex"
        }}
        width={{ xs: "full", sm: "full", md: "auto" }}
        alignItems="center"
        flexGrow={1}
        justifyContent={{ xs: "flex-start", sm: "flex-start", md: "flex-end" }}
      >
        <Link
          to="/login"
          mt={{ base: 4, md: 0 }}
          mr={6}
          display="block"
          fontWeight={600}
        >
          Log In
        </Link>
      </Box>

      <Box
        display={{
          xs: isMenuOpen ? "block" : "none",
          sm: isMenuOpen ? "block" : "none",
          md: "block"
        }}
        mt={{ base: 4, md: 0 }}
      >
        <Button as={ReachLink} to="/register" colorScheme="purple" shadow="md">
          Sign Up Free
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;
