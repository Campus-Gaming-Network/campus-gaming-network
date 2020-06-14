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
      <Box bg="gray.200" w="65px" h="38px" mr="2" borderRadius="md" />
      <Box bg="purple.500" w="125px" h="38px" borderRadius="md" />
    </nav>
  );
};

export default NavSilhouette;
