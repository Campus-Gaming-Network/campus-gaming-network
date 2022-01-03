// Libraries
import React from 'react';
import { Heading } from '@chakra-ui/react';

////////////////////////////////////////////////////////////////////////////////
// PageHeading

const PageHeading = ({ children, ...rest }) => {
  return (
    <Heading as="h2" size="2xl" pb={12} px={{ base: 8, md: 0 }} {...rest}>
      {children}
    </Heading>
  );
};

export default PageHeading;
