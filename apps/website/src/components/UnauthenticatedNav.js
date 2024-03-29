// Libraries
import React from "react";
import { useBoolean } from "@chakra-ui/react";
import { useRouter } from "next/router";

// Components
import NavWrapper from "src/components/NavWrapper";
import SchoolSearch from "src/components/SchoolSearch";
import Logo from "src/components/Logo";
import Link from "src/components/Link";
import ButtonLink from "src/components/ButtonLink";
import { Box, Flex, Button } from "src/components/common";

////////////////////////////////////////////////////////////////////////////////
// UnauthenticatedNav

const UnauthenticatedNav = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useBoolean();

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
        alignItems="center"
        flexGrow={{ base: 0, md: 1 }}
        justifyContent={{ base: "flex-start", md: "flex-end" }}
      >
        <Link
          href="/login"
          mr={3}
          fontSize="sm"
          color="gray.100"
          fontWeight={600}
        >
          Log In
        </Link>
        <ButtonLink href="/signup" colorScheme="brand" size="sm">
          Sign Up
        </ButtonLink>
      </Flex>
    </NavWrapper>
  );
};

export default UnauthenticatedNav;
