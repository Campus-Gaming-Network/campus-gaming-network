// Libraries
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faCog,
  faCrown,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";
import { useBoolean } from "@chakra-ui/react";
import safeJsonStringify from "safe-json-stringify";
import firebaseAdmin from "src/firebaseAdmin";
import nookies from "nookies";
import dynamic from "next/dynamic";

// Constants
import { COOKIES, NOT_FOUND } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import Link from "src/components/Link";
import Card from "src/components/Card";
import EmptyText from "src/components/EmptyText";
import {
  Stack,
  Box,
  Heading,
  Tooltip,
  List,
  ListItem,
  Flex,
  IconButton,
  VisuallyHidden,
  Text,
} from "src/components/common";

// API
import { getUserTeams } from "src/api/user";

// Providers
import { useAuth } from "src/providers/auth";

// Dynamic Components
const LeaveTeamDialog = dynamic(
  () => import("src/components/dialogs/LeaveTeamDialog"),
  { ssr: false }
);

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  let token;

  try {
    const cookies = nookies.get(context);
    token = Boolean(cookies?.[COOKIES.AUTH_TOKEN])
      ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
      : null;

    if (!Boolean(token?.uid)) {
      return NOT_FOUND;
    }
  } catch (error) {
    return NOT_FOUND;
  }

  const [teamsResponse] = await Promise.all([getUserTeams(token.uid)]);
  const { teams } = teamsResponse;

  const data = {
    params: context.params,
    teams,
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Teams

const Teams = (props) => {
  const { user } = useAuth();
  const [isTeamToLeaveDialogOpen, setTeamToLeaveDialogIsOpen] = useBoolean();
  const [teamToLeave, setTeamToLeave] = React.useState(null);

  const leaveTeam = (team) => {
    setTeamToLeave(team);
    setTeamToLeaveDialogIsOpen.on();
  };

  return (
    <SiteLayout>
      <Article>
        <Flex as="header" align="center" justify="space-between" mb={12}>
          <Box>
            <Heading
              as="h2"
              fontSize="5xl"
              fontWeight="bold"
              pb={2}
              display="flex"
              alignItems="center"
            >
              Your Teams ({props.teams.length || 0})
            </Heading>
          </Box>
        </Flex>
        {Boolean(props?.teams?.length) ? (
          <List as={Stack} spacing={4}>
            {props?.teams?.map((team) => (
              <TeamsListItem
                key={team.id}
                team={team}
                user={user}
                leaveTeam={leaveTeam}
              />
            ))}
          </List>
        ) : (
          <EmptyText>You are not apart of any teams.</EmptyText>
        )}
      </Article>

      {Boolean(teamToLeave) ? (
        <LeaveTeamDialog
          isOpen={isTeamToLeaveDialogOpen}
          onClose={setTeamToLeaveDialogIsOpen.off}
          team={teamToLeave}
        />
      ) : null}
    </SiteLayout>
  );
};

const TeamsListItem = (props) => {
  const isLeaderOfTeam = props.team.roles?.leader?.id === props.user?.id;
  const isOfficerOfTeam = props.team.roles?.officer?.id === props.user?.id;
  const canEditTeam = isLeaderOfTeam;
  const editTeamTooltip = canEditTeam
    ? "Edit team"
    : "You do not have permission to edit this team.";

  return (
    <ListItem key={props.team.id} as={Card}>
      <Flex align="center" justify="space-between">
        <Stack>
          <Flex align="center">
            {isLeaderOfTeam ? (
              <Tooltip label="Team leader">
                <Text as="span" color="yellow.500" fontSize="xs" mr={2}>
                  <FontAwesomeIcon icon={faCrown} />
                  <VisuallyHidden>Team leader</VisuallyHidden>
                </Text>
              </Tooltip>
            ) : null}
            {isOfficerOfTeam ? (
              <Tooltip label="Team officer">
                <Text as="span" color="yellow.500" fontSize="xs" mr={2}>
                  <FontAwesomeIcon icon={faMedal} />
                  <VisuallyHidden>Team officer</VisuallyHidden>
                </Text>
              </Tooltip>
            ) : null}
            <Link
              href={`/team/${props.team.id}`}
              color="brand.500"
              fontWeight="bold"
              fontSize="md"
            >
              {props.team.displayName}
            </Link>
          </Flex>
          <Text fontSize="xs" fontWeight="bold" color="gray.500">
            {props.team.memberCount}{" "}
            {props.team.memberCount === 1 ? "member" : "members"}
          </Text>
        </Stack>
        <Box>
          <IconButton
            as={Link}
            href={`/team/${props.team.id}/edit`}
            tooltip={editTeamTooltip}
            disabled={!canEditTeam}
            variant="outline"
            aria-label={editTeamTooltip}
            icon={<FontAwesomeIcon icon={faCog} />}
          />
          <Tooltip label="Leave team">
            <IconButton
              onClick={() => props.leaveTeam(props.team)}
              variant="ghost"
              colorScheme="red"
              aria-label="Leave team"
              icon={<FontAwesomeIcon icon={faSignOutAlt} />}
              ml={4}
            />
          </Tooltip>
        </Box>
      </Flex>
    </ListItem>
  );
};

export default Teams;
