// Libraries
import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

// Components
import UserListItem from "src/components/UserListItem";
import Slider from "src/components/Slider";

const RecentlyCreatedUsers = (props) => {
  const [users, setUsers] = React.useState(props.users || []);
  const hasUsers = React.useMemo(() => Boolean(users) && users.length > 0, [
    users,
  ]);

  return (
    <Box as="section" spacing={2} py={4}>
      <Heading as="h3" fontSize="xl" pb={4}>
        Newest users
      </Heading>
      {hasUsers ? (
        <React.Fragment>
          <Slider
            settings={{
              slidesToShow: 10,
              className: users.length < 10 ? "slick--less-slides" : "",
            }}
          >
            {users.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </Slider>
        </React.Fragment>
      ) : (
        <Text color="gray.400" fontSize="xl" fontWeight="600">
          No users have been recently created
        </Text>
      )}
    </Box>
  );
};

export default RecentlyCreatedUsers;
