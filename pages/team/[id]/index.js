// Libraries
import React from "react";
import {
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  VisuallyHidden,
} from "@chakra-ui/react";
import safeJsonStringify from "safe-json-stringify";

// API
import { getTeamDetails } from "src/api/team";

// Constants
import { NOT_FOUND } from "src/constants/other";

// Components
import SiteLayout from "src/components/SiteLayout";
import Article from "src/components/Article";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  const [teamResponse] = await Promise.all([getTeamDetails(context.params.id)]);
  const { team } = teamResponse;

  if (!Boolean(team)) {
    return NOT_FOUND;
  }

  const data = {
    params: context.params,
    team,
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Team

const Team = (props) => {
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
        </Stack>
      </Article>
    </SiteLayout>
  );
};

export default Team;
