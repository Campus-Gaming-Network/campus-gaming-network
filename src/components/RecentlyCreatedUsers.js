// Libraries
import React from "react";
import {
  Stack,
  Box,
  Heading,
  Text,
  List,
  ListItem,
  Avatar
} from "@chakra-ui/react";

// Components
import Link from "src/components/Link";

const RecentlyCreatedUsers = props => {
  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Newest Users
      </Heading>
      {Boolean(props.users) && props.users.length > 0 ? (
        <React.Fragment>
          <List d="flex" flexWrap="wrap" m={-2}>
            {props.users.map(user => (
              <ListItem w={{ base: "50%", sm: "33.3333%", md: "20%" }}>
                <Box
                  shadow="sm"
                  borderWidth={1}
                  rounded="lg"
                  bg="white"
                  pos="relative"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  mr={4}
                  p={4}
                  height="calc(100% - 1rem)"
                >
                  <Avatar
                    name={user.fullName}
                    title={props.fullName}
                    src={user.gravatarUrl}
                    size="md"
                  />
                  <Link
                    href={`/user/${user.id}`}
                    color="brand.500"
                    fontWeight="bold"
                    mt={4}
                    fontSize="sm"
                    lineHeight="1.2"
                    textAlign="center"
                  >
                    {user.fullName}
                  </Link>
                </Box>
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      ) : (
        <Text color="gray.400" fontSize="xl" fontWeight="600">
          No users have been recently created
        </Text>
      )}
    </Stack>
  );
};

export default RecentlyCreatedUsers;
