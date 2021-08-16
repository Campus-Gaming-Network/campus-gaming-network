// Libraries
import React from "react";
import {
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  VisuallyHidden,
  List,
} from "@chakra-ui/react";
import safeJsonStringify from "safe-json-stringify";

// API
import { getTeamDetails, getTeamUsers } from "src/api/team";

// Constants
import { NOT_FOUND } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import UserListItem from "src/components/UserListItem";
import EmptyText from "src/components/EmptyText";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  const [teamResponse, teamUsersResponse] = await Promise.all([
    getTeamDetails(context.params.id),
    getTeamUsers(context.params.id),
  ]);
  const { team } = teamResponse;
  const { teammates } = teamUsersResponse;

  if (!Boolean(team)) {
    return NOT_FOUND;
  }

  const data = {
    params: context.params,
    team,
    teammates,
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Team

const Team = (props) => {
  console.log(props);
  return (
    <SiteLayout meta={props.team.meta}>
      <Box bg="gray.200" h="150px" />
      <Article>
        <Stack spacing={10}>
          <Flex
            as="header"
            align="center"
            justify="space-between"
            px={{ base: 4, md: 0 }}
            pt={8}
          >
            <Heading as="h2" fontSize="5xl" fontWeight="bold" pb={2}>
              {props.team.name} ({props.team.memberCount || 0})
            </Heading>
          </Flex>
          <Box as="section" pt={4}>
            <VisuallyHidden as="h2">Description</VisuallyHidden>
            <Text>{props.team.description}</Text>
          </Box>
          <Stack as="section" spacing={4}>
            <Heading as="h4" fontSize="xl">
              Team members
            </Heading>
            <UsersList users={props.teammates} />
          </Stack>
        </Stack>
      </Article>
    </SiteLayout>
  );
};

////////////////////////////////////////////////////////////////////////////////
// UsersList

const UsersList = (props) => {
  const hasUsers = React.useMemo(() => {
    return Boolean(props.users) && props.users.length > 0;
  }, [props.users]);

  if (hasUsers) {
    return (
      <React.Fragment>
        <List display="flex" flexWrap="wrap" mx={-2}>
          {props.users.map(({ user }) => (
            <UserListItem key={user.id} user={user} />
          ))}
        </List>
      </React.Fragment>
    );
  }

  return <EmptyText mt={4}>This team currently has no users.</EmptyText>;
};

export default Team;
