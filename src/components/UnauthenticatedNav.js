import React from "react";
import { Box, Flex, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

// Components
import NavWrapper from "src/components/NavWrapper";
import SchoolSearch from "src/components/SchoolSearch";
import Logo from "src/components/Logo";
import Link from "src/components/Link";
import ButtonLink from "src/components/ButtonLink";

const UnauthenticatedNav = () => {
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
        alignItems="center"
        flexGrow={1}
        justifyContent="flex-end"
      >
        <ButtonLink href="/login" mr={3}>
          Log In
        </ButtonLink>
        <ButtonLink href="/signup" colorScheme="brand">
          Sign Up
        </ButtonLink>
      </Box>
    </NavWrapper>
  );
};

export default UnauthenticatedNav;
