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
import { getTournamentDetails } from "src/api/tournament";

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
  const [tournamentResponse] = await Promise.all([
    getTournamentDetails(context.params.id),
  ]);
  const { tournament } = tournamentResponse;

  if (!Boolean(tournament)) {
    return NOT_FOUND;
  }

  const data = {
    params: context.params,
    tournament,
  };

  try {
    const cookies = nookies.get(context);
    const token = Boolean(cookies?.[COOKIES.AUTH_TOKEN])
      ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
      : null;
  } catch (error) {
    return NOT_FOUND;
  }

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// Tournament

const Tournament = (props) => {
  const [isReportingTournamentDialogOpen, setReportingTournamentDialogIsOpen] =
    useBoolean();

  return (
    <SiteLayout meta={props.tournament.meta}>
      <Box bg="gray.200" h="150px" />
      <Article>
        <Box mb={10} textAlign="center" display="flex" justifyContent="center">
          <Link
            href={`/tournament/${props.tournament.id}/edit`}
            fontWeight="bold"
            width="100%"
            borderRadius="md"
            bg="gray.100"
            _focus={{ bg: "gray.200", boxShadow: "outline" }}
            _hover={{ bg: "gray.200" }}
            p={8}
          >
            Edit Tournament
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
              {props.tournament.name} ({props.tournament.memberCount || 0})
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
                    Leave {props.tournament.name}
                  </MenuItem>
                  <MenuItem
                    onClick={setReportingUserDialogIsOpen.on}
                    icon={<FontAwesomeIcon icon={faFlag} />}
                  >
                    Report {props.tournament.name}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
          <Box as="section" pt={4}>
            <VisuallyHidden as="h2">Description</VisuallyHidden>
            <Text>{props.tournament.description}</Text>
          </Box>
          <ChallongeBracket id={props.tournament.challonge.id} />
        </Stack>
      </Article>

      {isAuthenticated ? (
        <ReportEntityDialog
          entity={{
            type: "tournaments",
            id: props.tournament.id,
          }}
          pageProps={props}
          isOpen={isReportingTournamentDialogOpen}
          onClose={setReportingTournamentDialogIsOpen.off}
        />
      ) : null}
    </SiteLayout>
  );
};

export default Tournament;
