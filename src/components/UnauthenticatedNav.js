import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

// Components
import Nav from "src/components/Nav";
import SchoolSearch from "src/components/SchoolSearch";
import Logo from "src/components/Logo";
import Link from "src/components/Link";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onSchoolSelect = selectedSchool => {
    if (selectedSchool && selectedSchool.id) {
      router.push(`/school/${selectedSchool.id}`);
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
        <Link href="/login" colorScheme="gray" mr={3}>
          Log In
        </Link>
        <Link href="/signup" colorScheme="brand">
          Sign Up
        </Link>
      </Box>
    </Nav>
  );
};

export default Header;
