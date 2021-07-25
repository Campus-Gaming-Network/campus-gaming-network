// Libraries
import React from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Text,
  Button,
  Heading,
  Divider,
  Flex,
  FormErrorMessage,
} from "@chakra-ui/react";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import nookies from "nookies";
import safeJsonStringify from "safe-json-stringify";
import isEmpty from "lodash.isempty";

// Other
import firebaseAdmin from "src/firebaseAdmin";
import firebase from "src/firebase";

// Utilities
import { useFormFields } from "src/utilities/other";
import { validateCreateEvent } from "src/utilities/validation";

// Constants
import { COLLECTIONS } from "src/constants/firebase";
import { DASHED_DATE_TIME } from "src/constants/dateTime";
import { AUTH_STATUS } from "src/constants/auth";
import { COOKIES, NOT_FOUND } from "src/constants/other";

// API
import { getTeamDetails } from "src/api/team";
import { getTeammateDetails } from "src/api/teammate";

// Providers
import { useAuth } from "src/providers/auth";

// Components
// import EventForm from "src/components/EventForm";
import SiteLayout from "src/components/SiteLayout";
import Card from "src/components/Card";
import Article from "src/components/Article";
import Link from "src/components/Link";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  let token;

  try {
    const cookies = nookies.get(context);
    token =
      Boolean(cookies) && Boolean(cookies[COOKIES.AUTH_TOKEN])
        ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
        : null;
    const authStatus =
      Boolean(token) && Boolean(token.uid)
        ? AUTH_STATUS.AUTHENTICATED
        : AUTH_STATUS.UNAUTHENTICATED;

    if (authStatus === AUTH_STATUS.UNAUTHENTICATED) {
      return NOT_FOUND;
    }
  } catch (error) {
    return NOT_FOUND;
  }

  const { team } = await getTeamDetails(context.params.id);

  if (!Boolean(team)) {
    return NOT_FOUND;
  }

  const { teammate } = await getTeammateDetails(context.params.id, token.uid);

  // User is already part of the team.
  if (Boolean(teammate)) {
    return NOT_FOUND;
  }

  const data = {
    params: context.params,
    team,
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// JoinTeam

const JoinTeam = (props) => {
  const [fields, handleFieldChange] = useFormFields({
    password: "",
  });
  const { user } = useAuth();
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <SiteLayout>
      <Article fullWidthMobile>
        {hasErrors ? (
          <Alert status="error" mb={4} rounded="lg">
            <AlertIcon />
            <AlertDescription>
              There are errors in the form below. Please review and correct
              before submitting again.
            </AlertDescription>
          </Alert>
        ) : null}
        <Card as="form" p={12} onSubmit={handleSubmit}>
          <Heading as="h2" size="2xl">
            Join team {props.team.name}
          </Heading>
          <Divider borderColor="gray.300" mt={12} mb={10} />
          {error ? (
            <Alert status="error" mb={12} rounded="lg">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <Stack spacing={6}>
            <FormControl isRequired isInvalid={errors.password}>
              <FormLabel htmlFor="password" fontSize="lg" fontWeight="bold">
                Password
              </FormLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="******************"
                onChange={handleFieldChange}
                value={fields.password}
                size="lg"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
          </Stack>
          <Button
            colorScheme="brand"
            type="submit"
            size="lg"
            w="full"
            isDisabled={isLoading}
            isLoading={isLoading}
            loadingText="Joining team..."
            my={12}
          >
            Join Team
          </Button>
        </Card>
      </Article>
    </SiteLayout>
  );
};

export default JoinTeam;
