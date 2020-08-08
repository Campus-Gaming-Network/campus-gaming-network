import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Box, Button, Flex, Heading } from "@chakra-ui/core";
import { Link as ReachLink } from "@reach/router";

// Components
import Link from "./Link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      borderBottomWidth={2}
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
        display={{ sm: isMenuOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <Button as={ReachLink} to="/register" variantColor="purple" shadow="md">
          Sign Up Free
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;
