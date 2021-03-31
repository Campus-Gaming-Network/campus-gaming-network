// Libraries
import React from "react";
import LazyLoad from "react-lazyload";
import { Box, Heading, Text } from "@chakra-ui/react";

// Hooks
import useFetchRecentlyCreatedUsers from "src/hooks/useFetchRecentlyCreatedUsers";

// Components
import UserListItem from "src/components/UserListItem";
import Slider from "src/components/Slider";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";

const RecentlyCreatedUsers = () => {
  const [users, state] = useFetchRecentlyCreatedUsers();
  const hasUsers = React.useMemo(() => Boolean(users) && users.length > 0, [
    users,
  ]);

  return (
    <LazyLoad once height={200}>
      {state === "idle" || state === "loading" ? (
        <SliderSilhouette />
      ) : (
        <Box as="section" py={4}>
          <Heading as="h3" fontSize="xl" pb={4}>
            Newest users
          </Heading>
          {!(state === "done" && hasUsers) ? (
            <Text color="gray.400" fontSize="xl" fontWeight="600">
              No users have been recently created
            </Text>
          ) : (
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
          )}
        </Box>
      )}
    </LazyLoad>
  );
};

export default RecentlyCreatedUsers;
