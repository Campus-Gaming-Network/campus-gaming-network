// Libraries
import React from "react";

// Hooks
import useFetchRecentlyCreatedUsers from "src/hooks/useFetchRecentlyCreatedUsers";

// Components
import UserListItem from "src/components/UserListItem";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";
import EmptyText from "src/components/EmptyText";
import { Box, Heading, Wrap, WrapItem } from "src/components/common";

////////////////////////////////////////////////////////////////////////////////
// RecentlyCreatedUsers

const RecentlyCreatedUsers = () => {
  const [{ users }, state] = useFetchRecentlyCreatedUsers(50);
  const hasUsers = React.useMemo(
    () => Boolean(users) && users.length > 0,
    [users]
  );

  return (
    <React.Fragment>
      {state === "idle" || state === "loading" ? (
        <SliderSilhouette />
      ) : (
        <Box as="section" py={4}>
          <Heading as="h3" fontSize="xl" pb={4}>
            Newest users
          </Heading>
          {!(state === "done" && hasUsers) ? (
            <EmptyText>No users have been recently created</EmptyText>
          ) : (
            <Wrap>
              {users.map((user) => (
                <WrapItem key={user.id}>
                  <UserListItem user={user} />
                </WrapItem>
              ))}
            </Wrap>
          )}
        </Box>
      )}
    </React.Fragment>
  );
};

export default RecentlyCreatedUsers;
