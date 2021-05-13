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
} from "@chakra-ui/react";
import dynamic from "next/dynamic";

// Components
import SiteLayout from "src/components/SiteLayout";
import FormSilhouette from "src/components/silhouettes/FormSilhouette";
import Article from "src/components/Article";
import PageHeading from "src/components/PageHeading";

// Constants
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
    formDispatch({ field: "description", value: props.team.description });
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
        <Stack as="form" spacing={6} onSubmit={handleSubmit}>
          <Flex alignItems="center" flexWrap="wrap">
            <PageHeading>
              {props.state === "edit" ? "Edit Team" : "Create a Team"}
            </PageHeading>
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
          <Spacer />
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
