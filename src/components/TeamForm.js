// Libraries
import React from "react";
import isEmpty from "lodash.isempty";
import {
  Input,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Button,
  Textarea,
  Text,
  FormErrorMessage,
  Spinner,
  Checkbox,
  Flex,
  Avatar,
  Alert,
  AlertIcon,
  AlertDescription,
  Spacer,
  VisuallyHidden,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";

// Components
import SiteLayout from "src/components/SiteLayout";
import FormSilhouette from "src/components/silhouettes/FormSilhouette";
import Article from "src/components/Article";
import PageHeading from "src/components/PageHeading";
import Card from "src/components/Card";
import GameSearch from "src/components/GameSearch";
import GameCover from "src/components/GameCover";
import MonthSelect from "src/components/MonthSelect";
import DaySelect from "src/components/DaySelect";
import YearSelect from "src/components/YearSelect";
import TimeSelect from "src/components/TimeSelect";

// Constants
import { MAX_DESCRIPTION_LENGTH } from "src/constants/event";
import { PRODUCTION_URL } from "src/constants/other";

// Providers
import { useAuth } from "src/providers/auth";

// Dynamic Components
const DeleteTeamDialog = dynamic(
  () => import("src/components/dialogs/DeleteTeamDialog"),
  { ssr: false }
);

////////////////////////////////////////////////////////////////////////////////
// Form Reducer

const initialFormState = {
  name: "",
  shortName: "",
  description: "",
  website: "",
};

const formReducer = (state, { field, value }) => {
  return {
    ...state,
    [field]: value,
  };
};

////////////////////////////////////////////////////////////////////////////////
// TeamForm

const TeamForm = (props) => {
  const { isAuthenticating, user } = useAuth();
  const [hasPrefilledForm, setHasPrefilledForm] = React.useState(false);
  const [formState, formDispatch] = React.useReducer(
    formReducer,
    initialFormState
  );
  const [isDeletingTeamAlertOpen, setDeletingTeamAlertIsOpen] = React.useState(
    false
  );
  const handleFieldChange = React.useCallback((e) => {
    formDispatch({ field: e.target.name, value: e.target.value });
  }, []);
  const hasErrors = React.useMemo(() => !isEmpty(props.errors), [props.errors]);
  const pageTitle = React.useMemo(
    () => (props.state === "edit" ? `Edit ${props.team.name}` : "Create Team"),
    [props.state, props.team]
  );
  const descriptionCharactersRemaining = React.useMemo(
    () =>
      formState.description
        ? MAX_DESCRIPTION_LENGTH - formState.description.length
        : MAX_DESCRIPTION_LENGTH,
    [formState.description]
  );

  const openDeleteTeamDialog = () => {
    setDeletingTeamAlertIsOpen(true);
  };

  const closeDeleteTeamDialog = () => {
    setDeletingTeamAlertIsOpen(false);
  };

  const handleSubmit = (e) => {
    props.onSubmit(e, formState);
  };

  const prefillForm = () => {
    formDispatch({ field: "name", value: props.team.name });
    formDispatch({ field: "shortName", value: props.team.shortName });
    formDispatch({ field: "description", value: props.team.description });
    formDispatch({ field: "website", value: props.team.website });
    setHasPrefilledForm(true);
  };

  const url = React.useMemo(() => {
    if (props.state === "edit") {
      return `${PRODUCTION_URL}/team/${props.team.id}/edit`;
    } else {
      return `${PRODUCTION_URL}/create-team`;
    }
  }, [props.state, props.team]);

  if (isAuthenticating) {
    return (
      <SiteLayout meta={{ title: pageTitle, og: { url } }}>
        <FormSilhouette />
      </SiteLayout>
    );
  }

  if (props.state === "edit" && !hasPrefilledForm) {
    prefillForm();
  }

  return (
    <SiteLayout meta={{ title: pageTitle, og: { url } }}>
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
        <Stack as="form" spacing={2} onSubmit={handleSubmit}>
          <Flex alignItems="center" flexWrap="wrap">
            <PageHeading>{pageTitle}</PageHeading>
            <Spacer />
            {props.state === "edit" ? (
              <Button
                variant="ghost"
                colorScheme="red"
                size="lg"
                onClick={openDeleteTeamDialog}
              >
                Delete team
              </Button>
            ) : null}
          </Flex>
          <Card as="fieldset">
            <VisuallyHidden>
              <Text as="legend" fontWeight="bold" fontSize="2xl">
                Details
              </Text>
            </VisuallyHidden>
            <Stack spacing={6} p={8}>
              <Box>
                <Text fontSize="lg" fontWeight="bold" pb={2}>
                  Team Creator
                </Text>
                <Flex>
                  {user.gravatar ? (
                    <Avatar
                      name={user.fullName}
                      title={user.fullName}
                      src={user.gravatarUrl}
                      size="sm"
                    />
                  ) : null}
                  <Text ml={4} as="span" alignSelf="center">
                    {user.fullName}
                  </Text>
                </Flex>
              </Box>
              <FormControl isRequired isInvalid={props.errors.name}>
                <FormLabel htmlFor="name" fontSize="lg" fontWeight="bold">
                  Team Name
                </FormLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Cloud9"
                  maxLength="255"
                  onChange={handleFieldChange}
                  value={formState.name}
                  size="lg"
                />
                <FormErrorMessage>{props.errors.name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={props.errors.shortName}>
                <FormLabel htmlFor="shortName" fontSize="lg" fontWeight="bold">
                  Short name / Abbreviation
                </FormLabel>
                <Input
                  id="shortName"
                  name="shortName"
                  type="text"
                  placeholder="C9"
                  maxLength="10"
                  onChange={handleFieldChange}
                  value={formState.shortName}
                  size="lg"
                />
                <FormErrorMessage>{props.errors.shortName}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={props.errors.description}>
                <FormLabel
                  htmlFor="description"
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Description
                </FormLabel>
                <Textarea
                  id="description"
                  name="description"
                  onChange={handleFieldChange}
                  value={formState.description}
                  placeholder="Tell people what your team is about."
                  size="lg"
                  resize="vertical"
                  maxLength="5000"
                  h="150px"
                />
                <FormHelperText id="description-helper-text">
                  Describe your team in fewer than{" "}
                  {MAX_DESCRIPTION_LENGTH.toLocaleString()} characters.{" "}
                  <Text
                    as="span"
                    color={
                      descriptionCharactersRemaining <= 0
                        ? "red.500"
                        : undefined
                    }
                  >
                    {descriptionCharactersRemaining.toLocaleString()} characters
                    remaining.
                  </Text>
                </FormHelperText>
              </FormControl>
              <FormControl isInvalid={props.errors.website}>
                <FormLabel htmlFor="website" fontSize="lg" fontWeight="bold">
                  Website
                </FormLabel>
                <Input
                  id="website"
                  name="website"
                  type="text"
                  placeholder="https://cloud9.gg/"
                  maxLength="255"
                  onChange={handleFieldChange}
                  value={formState.website}
                  size="lg"
                />
                <FormErrorMessage>{props.errors.website}</FormErrorMessage>
              </FormControl>
            </Stack>
          </Card>
          <Box pt={16}>
            <Button
              colorScheme="brand"
              type="submit"
              size="lg"
              w="full"
              disabled={props.isSubmitting}
            >
              {props.isSubmitting
                ? "Submitting..."
                : props.state === "edit"
                ? "Edit Team"
                : "Create Team"}
            </Button>
          </Box>
        </Stack>
      </Article>

      {props.state === "edit" ? (
        <DeleteTeamDialog
          event={props.team}
          isOpen={isDeletingTeamAlertOpen}
          onClose={closeDeleteTeamDialog}
        />
      ) : null}
    </SiteLayout>
  );
};

export default TeamForm;
