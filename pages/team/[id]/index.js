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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBoolean,
} from "@chakra-ui/react";
import safeJsonStringify from "safe-json-stringify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import nookies from "nookies";
import {
  faEllipsisV,
  faFlag,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";

// API
import { getTeamDetails, getTeamUsers } from "src/api/team";
import { getUserTeammateDetails } from "src/api/user";

// Constants
import { COOKIES, NOT_FOUND } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import UserListItem from "src/components/UserListItem";
import EmptyText from "src/components/EmptyText";
import Link from "src/components/Link";

// Other
import firebaseAdmin from "src/firebaseAdmin";

// Providers
import { useAuth } from "src/providers/auth";

// Dynamic Components
const ReportEntityDialog = dynamic(
  () => import("src/components/dialogs/ReportEntityDialog"),
  {
    ssr: false,
  }
);

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
    isPartOfTeam: false,
  };

  try {
    const cookies = nookies.get(context);
    const token = Boolean(cookies?.[COOKIES.AUTH_TOKEN])
      ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
      : null;

    if (Boolean(token?.uid)) {
      const [userTeammateResponse] = await Promise.all([
        getUserTeammateDetails(context.params.id, token.uid),
      ]);
      const { teammate } = userTeammateResponse;
      data.isPartOfTeam = Boolean(teammate);
    }
  } catch (error) {
    return NOT_FOUND;
  }

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Team

const Team = (props) => {
  const { isAuthenticated } = useAuth();
  const [
    isReportingTeamDialogOpen,
    setReportingTeamDialogIsOpen,
  ] = useBoolean();

  return (
    <SiteLayout meta={props.team.meta}>
      <Box bg="gray.200" h="150px" />
      <Article>
        <Box mb={10} textAlign="center" display="flex" justifyContent="center">
          <Link
            href={`/team/${props.team.id}/edit`}
            fontWeight="bold"
            width="100%"
            borderRadius="md"
            bg="gray.100"
            _focus={{ bg: "gray.200", boxShadow: "outline" }}
            _hover={{ bg: "gray.200" }}
            p={8}
          >
            Edit Team
          </Link>
        </Box>
        <Stack spacing={10}>
          <Flex
            as="header"
            align="center"
            justify="space-between"
            px={{ base: 4, md: 0 }}
            pt={8}
          >
            <Heading as="h2" fontSize="5xl" fontWeight="bold" pb={2}>
              {props.team.name} ({props.team.memberCount})
            </Heading>
            <Box>
              <Menu>
                <MenuButton
                  as={IconButton}
                  size="sm"
                  icon={<FontAwesomeIcon icon={faEllipsisV} />}
                  aria-label="Options"
                />
                <MenuList fontSize="md">
                  <MenuItem
                    color="red.500"
                    fontWeight="bold"
                    icon={<FontAwesomeIcon icon={faSignOutAlt} />}
                  >
                    Leave {props.team.name}
                  </MenuItem>
                  <MenuItem
                    onClick={setReportingTeamDialogIsOpen.on}
                    icon={<FontAwesomeIcon icon={faFlag} />}
                  >
                    Report {props.team.name}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
          <Box as="section" pt={4}>
            <VisuallyHidden as="h2">Description</VisuallyHidden>
            <Text>{props.team.description}</Text>
          </Box>
          <Stack as="section" spacing={4}>
            <Heading as="h4" fontSize="xl">
              Team members
            </Heading>
            <UsersList team={props.team} users={props.teammates} />
          </Stack>
        </Stack>
      </Article>

      {isAuthenticated ? (
        <ReportEntityDialog
          entity={{
            type: "teams",
            id: props.team.id,
          }}
          pageProps={props}
          isOpen={isReportingTeamDialogOpen}
          onClose={setReportingTeamDialogIsOpen.off}
        />
      ) : null}
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
            <UserListItem
              key={user.id}
              user={user}
              teamLeader={props.team?.roles?.leader?.id === user.id}
              teamOfficer={props.team?.roles?.officer?.id === user.id}
            />
          ))}
        </List>
      </React.Fragment>
    );
  }

  return <EmptyText mt={4}>This team currently has no users.</EmptyText>;
};

export default Team;
