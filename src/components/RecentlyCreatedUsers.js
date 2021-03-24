// Libraries
import React from "react";
import { Stack, Heading, Text, List } from "@chakra-ui/react";

// Components
import UserListItem from "src/components/UserListItem";

const RecentlyCreatedUsers = (props) => {
  const [users, setUsers] = React.useState(props.users || []);
  const hasUsers = React.useMemo(() => Boolean(users) && users.length > 0, [
    users,
  ]);

  return (
    <Stack as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Newest users
      </Heading>
      {hasUsers ? (
        <React.Fragment>
          <List d="flex" flexWrap="wrap" m={-2}>
            {users.map((user) => (
              <UserListItem key={user.id} user={user} />
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
