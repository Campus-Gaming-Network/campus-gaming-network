// Libraries
import React from "react";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Button,
  Heading,
  Divider,
  useToast,
  FormErrorMessage,
  useBoolean,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import nookies from "nookies";
import safeJsonStringify from "safe-json-stringify";
import isEmpty from "lodash.isempty";
import { httpsCallable } from "firebase/functions";

// Other
import { functions } from "src/firebase";
import firebaseAdmin from "src/firebaseAdmin";

// Utilities
import { noop, useFormFields } from "src/utilities/other";

// Constants
import { COOKIES, NOT_FOUND } from "src/constants/other";
import { CALLABLES } from "src/constants/firebase";

// API
import { getTeamDetails } from "src/api/team";
import { getTeammateDetails } from "src/api/teammate";

// Providers
import { useAuth } from "src/providers/auth";

// Components
import SiteLayout from "src/components/SiteLayout";
import Card from "src/components/Card";
import Article from "src/components/Article";
import FormErrorAlert from "src/components/FormErrorAlert";

////////////////////////////////////////////////////////////////////////////////
// getServerSideProps

export const getServerSideProps = async (context) => {
  let token;

  try {
    const cookies = nookies.get(context);
    token = Boolean(cookies?.[COOKIES.AUTH_TOKEN])
      ? await firebaseAdmin.auth().verifyIdToken(cookies[COOKIES.AUTH_TOKEN])
      : null;
  } catch (error) {
    noop();
  }

  const { team } = await getTeamDetails(context.params.id);

  if (!Boolean(team)) {
    return NOT_FOUND;
  }

  let teammate;

  if (Boolean(token?.uid)) {
    const response = await getTeammateDetails(context.params.id, token.uid);
    teammate = response?.teammate;
  }

  const data = {
    params: context.params,
    team,
    alreadyJoinedTeam: Boolean(teammate),
  };

  return { props: JSON.parse(safeJsonStringify(data)) };
};

////////////////////////////////////////////////////////////////////////////////
// JoinTeam

const JoinTeam = (props) => {
  const router = useRouter();
  const toast = useToast();
  const [fields, handleFieldChange] = useFormFields({
    password: "",
  });
  const { isAuthenticating, isAuthenticated } = useAuth();
  const [error, setError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = useBoolean();
  const [errors, setErrors] = React.useState({});
  const hasErrors = React.useMemo(() => !isEmpty(errors), [errors]);
  const [isShowingPassword, setIsShowingPassword] = useBoolean();

  const handleSubmitError = (error) => {
    setIsSubmitting.off();
    toast({
      title: "An error occurred.",
      description:
        error?.message ||
        "There was an error joining the team. Please try again.",
      status: "error",
      isClosable: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (props.alreadyJoinedTeam || !isAuthenticated) {
      return;
    }

    setIsSubmitting.on();

    const data = {
      teamId: props.team.id,
      password: fields?.password.trim(),
    };

    const joinTeam = httpsCallable(functions, CALLABLES.JOIN_TEAM);

    try {
      const result = await joinTeam(data);

      if (Boolean(result?.data?.teamId)) {
        toast({
          title: "Team joined.",
          description: `You have joined "${props.team.name}". You will be redirected...`,
          status: "success",
          isClosable: true,
        });
        setTimeout(() => {
          router.push(`/team/${result.data.teamId}`);
        }, 2000);
      } else {
        handleSubmitError(result?.data?.error);
      }
    } catch (error) {
      handleSubmitError(error);
    }
  };

  return (
    <SiteLayout>
      <Article fullWidthMobile>
        {hasErrors ? <FormErrorAlert /> : null}
        {!isAuthenticating && !isAuthenticated ? (
          <Alert status="warning" mb={4} rounded="lg">
            <AlertIcon />
            <AlertDescription>
              You must be logged in to join this team.
            </AlertDescription>
          </Alert>
        ) : null}
        {props.alreadyJoinedTeam ? (
          <Alert status="info" mb={4} rounded="lg">
            <AlertIcon />
            <AlertDescription>
              You are already a part of this team.
            </AlertDescription>
          </Alert>
        ) : null}
        <Card
          as="form"
          p={12}
          onSubmit={!props.alreadyJoinedTeam ? handleSubmit : null}
        >
          <Heading as="h2" size="2xl">
            Join team "{props.team.name}"
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
                Team Password
              </FormLabel>
              <Input
                id="password"
                name="password"
                type={isShowingPassword ? "text" : "password"}
                placeholder="******************"
                onChange={handleFieldChange}
                value={fields.password}
                size="lg"
                disabled={
                  props.alreadyJoinedTeam ||
                  (!isAuthenticating && !isAuthenticated)
                }
              />
              <Button
                onClick={setIsShowingPassword.toggle}
                fontSize="sm"
                fontStyle="italic"
                variant="link"
                fontWeight="normal"
              >
                {isShowingPassword ? "Hide" : "Show"} password
              </Button>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
          </Stack>
          <Button
            colorScheme="brand"
            type="submit"
            size="lg"
            w="full"
            isDisabled={
              isSubmitting ||
              props.alreadyJoinedTeam ||
              (!isAuthenticating && !isAuthenticated)
            }
            isLoading={isSubmitting}
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
