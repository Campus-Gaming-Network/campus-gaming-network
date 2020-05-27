import React from "react";
import { Box } from "@chakra-ui/core";

const NavSilhouette = () => {
  const [isMenuOpen] = React.useState(false);

  return (
    <nav
      role="navigation"
      className={`${
        isMenuOpen ? "block" : "hidden"
      } px-2 pt-2 pb-4 sm:flex items-center sm:p-0`}
    >
      <Box
        bg="gray.200"
        w="48px"
        h="48px"
        ml="5"
        mr="2"
        my="1"
        borderRadius="full"
      />
      <Box bg="purple.500" w="70px" h="28px" mr="5" borderRadius="md" />
      <Box
        bg="gray.200"
        w="48px"
        h="48px"
        ml="5"
        mr="2"
        my="1"
        borderRadius="full"
      />
      <Box bg="purple.500" w="70px" h="28px" mr="5" borderRadius="md" />
    </nav>
  );
};

export default NavSilhouette;
