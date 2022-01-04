// Libraries
import React from 'react';
import { Box, Text, Img, Stack, Flex } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartBroken } from '@fortawesome/free-solid-svg-icons';

// Components
import SiteLayout from 'src/components/SiteLayout';
import Article from 'src/components/Article';
import ButtonLink from 'src/components/ButtonLink';

////////////////////////////////////////////////////////////////////////////////
// NotFound

const NotFound = () => {
  return (
    <SiteLayout pb={0} minH="auto" bg="#e6e6e6">
      <Article>
        <Flex align="center" justify="center" h="100%">
          <Stack spacing={12} textAlign="center">
            <Img src="/404.svg" maxW={600} w="100%" mx="auto" />
            <Text fontSize="3xl" fontWeight="bold">
              Page not found{' '}
              <Text as="span" color="red.500">
                <FontAwesomeIcon icon={faHeartBroken} />
              </Text>
            </Text>
            <Box>
              <ButtonLink href="/" colorScheme="brand">
                Back to home
              </ButtonLink>
            </Box>
          </Stack>
        </Flex>
      </Article>
    </SiteLayout>
  );
};

export default NotFound;
