import React from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Link as ReachLink, navigate } from "@reach/router";

// Components
import Nav from "./Nav";
import SchoolSearch from "./SchoolSearch";
import Logo from "./Logo";

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
        alignItems="center"
        flexGrow={1}
        justifyContent="flex-end"
      >
        <Button as={ReachLink} to="/login" colorScheme="gray" mr={3}>
          Log In
        </Button>
        <Button as={ReachLink} to="/register" colorScheme="brand">
          Sign Up
        </Button>
      </Box>
    </Nav>
  );
};

export default Header;
