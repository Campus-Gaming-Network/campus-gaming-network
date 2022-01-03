// Libraries
import React from 'react';
import { Flex } from '@chakra-ui/react';

////////////////////////////////////////////////////////////////////////////////
// NavWrapper

const NavWrapper = (props) => (
  <Flex
    as="nav"
    role="navigation"
    align="center"
    justify="space-between"
    wrap="wrap"
    paddingX="1rem"
    height={{ base: 150, md: 125, lg: 50 }}
    bg="#323031"
    {...props}
  />
);

export default NavWrapper;
