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
  Flex,
  Spacer,
  VisuallyHidden,
  useBoolean,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";

// Components
import SiteLayout from "src/components/SiteLayout";
import FormSilhouette from "src/components/silhouettes/FormSilhouette";
import Article from "src/components/Article";
import PageHeading from "src/components/PageHeading";
import Card from "src/components/Card";
import FormErrorAlert from "src/components/FormErrorAlert";
import CharacterCounter from "src/components/CharacterCounter";

// Constants
import { MAX_DESCRIPTION_LENGTH } from "src/constants/event";
import { PRODUCTION_URL } from "src/constants/other";

// Providers
import { useAuth } from "src/providers/auth";

// Dynamic Components
const DeleteTournamentDialog = dynamic(
  () => import("src/components/dialogs/DeleteTournamentDialog"),
  { ssr: false }
);

////////////////////////////////////////////////////////////////////////////////
// Form Reducer

const initialFormState = {
  name: "",
  description: "",
};

const formReducer = (state, { field, value }) => {
  return {
    ...state,
    [field]: value,
  };
};

////////////////////////////////////////////////////////////////////////////////
// TournamentForm

const TournamentForm = (props) => {
  const { isAuthenticating } = useAuth();
  const [hasPrefilledForm, setHasPrefilledForm] = useBoolean();
  const [formState, formDispatch] = React.useReducer(
    formReducer,
    initialFormState
  );
  const [
    isDeletingTournamentAlertOpen,
    setDeletingTournamentAlertIsOpen,
  ] = useBoolean();
  const handleFieldChange = React.useCallback((e) => {
    formDispatch({ field: e.target.name, value: e.target.value });
  }, []);
  const hasErrors = React.useMemo(() => !isEmpty(props.errors), [props.errors]);
  const pageTitle = React.useMemo(
    () =>
      props.state === "edit"
        ? `Edit ${props.tournament.name}`
        : "Create Tournament",
    [props.state, props.tournament]
  );

  const handleSubmit = (e) => {
    props.onSubmit(e, formState);
  };

  const prefillForm = () => {
    formDispatch({ field: "name", value: props.team.name });
    formDispatch({ field: "description", value: props.team.description });
    setHasPrefilledForm.on();
  };

  const url = React.useMemo(() => {
    if (props.state === "edit") {
      return `${PRODUCTION_URL}/tournament/${props.tournament.id}/edit`;
    } else {
      return `${PRODUCTION_URL}/create-tournament`;
    }
  }, [props.state, props.tournament]);

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
        {hasErrors ? <FormErrorAlert /> : null}
        <Stack as="form" spacing={2} onSubmit={handleSubmit}>
          <Flex alignItems="center" flexWrap="wrap">
            <PageHeading>{pageTitle}</PageHeading>
            <Spacer />
            {props.state === "edit" ? (
              <Button
                variant="ghost"
                colorScheme="red"
                size="lg"
                onClick={setDeletingTournamentAlertIsOpen.on}
              >
                Delete tournament
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
              <FormControl isRequired isInvalid={props.errors.name}>
                <FormLabel htmlFor="name" fontSize="lg" fontWeight="bold">
                  Tournament Name
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
                  placeholder="Tell people what your tournament is about."
                  size="lg"
                  resize="vertical"
                  maxLength="5000"
                  h="150px"
                />
                <FormHelperText id="description-helper-text">
                  Describe your tournament in fewer than{" "}
                  {MAX_DESCRIPTION_LENGTH.toLocaleString()} characters.{" "}
                  <CharacterCounter
                    value={formState.description}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                  />
                </FormHelperText>
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
                ? "Edit Tournament"
                : "Create Tournament"}
            </Button>
          </Box>
        </Stack>
      </Article>

      {props.state === "edit" ? (
        <DeleteTournamentDialog
          event={props.tournament}
          isOpen={isDeletingTournamentAlertOpen}
          onClose={setDeletingTournamentAlertIsOpen.off}
        />
      ) : null}
    </SiteLayout>
  );
};

export default TournamentForm;
