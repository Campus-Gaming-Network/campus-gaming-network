// Libraries
import React from 'react';
import { Link, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

////////////////////////////////////////////////////////////////////////////////
// OutsideLink

const OutsideLink = ({ children, noIcon, ...props }) => {
  return (
    <Link color="brand.500" fontWeight={600} isExternal {...props}>
      {children}
      {!noIcon ? (
        <Text as="span" ml={1}>
          <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
        </Text>
      ) : null}
    </Link>
  );
};

export default OutsideLink;
