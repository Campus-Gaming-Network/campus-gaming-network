// Libraries
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faCog,
  faCrown,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";
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
} from "@chakra-ui/react";
import safeJsonStringify from "safe-json-stringify";
import firebaseAdmin from "src/firebaseAdmin";
import nookies from "nookies";

// Constants
import { COOKIES, NOT_FOUND } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";
import Link from "src/components/Link";
import Card from "src/components/Card";
import EmptyText from "src/components/EmptyText";

// API
import { getUserTeams } from "src/api/user";

// Providers
import { useAuth } from "src/providers/auth";

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

  console.log(props);
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
              <ListItem key={team.id} as={Card}>
                <Flex align="center" justify="space-between">
                  <Stack>
                    <Flex align="center">
                      {team.roles?.leader?.id === user?.id ? (
                        <Tooltip label="Team leader">
                          <Text
                            as="span"
                            color="yellow.500"
                            fontSize="xs"
                            mr={2}
                          >
                            <FontAwesomeIcon icon={faCrown} />
                            <VisuallyHidden>Team leader</VisuallyHidden>
                          </Text>
                        </Tooltip>
                      ) : null}
                      {team.roles?.officer?.id === user?.id ? (
                        <Tooltip label="Team officer">
                          <Text
                            as="span"
                            color="yellow.500"
                            fontSize="xs"
                            mr={2}
                          >
                            <FontAwesomeIcon icon={faMedal} />
                            <VisuallyHidden>Team officer</VisuallyHidden>
                          </Text>
                        </Tooltip>
                      ) : null}
                      <Link
                        href={`/team/${team.id}`}
                        color="brand.500"
                        fontWeight={600}
                        fontSize="md"
                      >
                        {team.name}{" "}
                        {team.shortName ? `(${team.shortName})` : ""}
                      </Link>
                    </Flex>
                    <Text fontSize="xs" fontWeight="bold" color="gray.500">
                      {team.memberCount || 0}{" "}
                      {team.memberCount === 1 ? "member" : "members"}
                    </Text>
                  </Stack>
                  <Box>
                    <Tooltip label="Edit team">
                      <IconButton
                        variant="outline"
                        aria-label="Edit team"
                        icon={<FontAwesomeIcon icon={faCog} />}
                      />
                    </Tooltip>
                    <Tooltip label="Leave team">
                      <IconButton
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
            ))}
          </List>
        ) : (
          <EmptyText>You are not apart of any teams.</EmptyText>
        )}
      </Article>
    </SiteLayout>
  );
};

export default Teams;
