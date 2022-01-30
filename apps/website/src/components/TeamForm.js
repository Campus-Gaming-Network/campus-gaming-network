// Libraries
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrown,
  faMedal,
  faBan,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
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
  Avatar,
  Spacer,
  VisuallyHidden,
  useBoolean,
  Heading,
  List,
  Switch,
  Portal,
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
import EmptyText from "src/components/EmptyText";
import UserListItem from "src/components/UserListItem";

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
const KickTeammateDialog = dynamic(
  () => import("src/components/dialogs/KickTeammateDialog"),
  { ssr: false }
);
const PromoteTeammateDialog = dynamic(
  () => import("src/components/dialogs/PromoteTeammateDialog"),
  { ssr: false }
);
const DemoteTeammateDialog = dynamic(
  () => import("src/components/dialogs/DemoteTeammateDialog"),
  { ssr: false }
);

////////////////////////////////////////////////////////////////////////////////
// Form Reducer

const initialFormState = {
  name: "",
  shortName: "",
  description: "",
  website: "",
  password: "",
  changePassword: false,
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
  const [hasPrefilledForm, setHasPrefilledForm] = useBoolean();
  const [formState, formDispatch] = React.useReducer(
    formReducer,
    initialFormState
  );
  const [isDeletingTeamAlertOpen, setDeletingTeamAlertIsOpen] = useBoolean();
  const handleFieldChange = React.useCallback((e) => {
    formDispatch({ field: e.target.name, value: e.target.value });
  }, []);
  const hasErrors = React.useMemo(() => !isEmpty(props.errors), [props.errors]);
  const pageTitle = React.useMemo(
    () => (props.state === "edit" ? `Edit ${props.team.name}` : "Create Team"),
    [props.state, props.team]
  );
  const [isShowingPassword, setIsShowingPassword] = useBoolean();

  const handleSubmit = (e) => {
    props.onSubmit(e, formState);
  };

  const prefillForm = () => {
    formDispatch({ field: "name", value: props.team.name });
    formDispatch({ field: "shortName", value: props.team.shortName });
    formDispatch({ field: "description", value: props.team.description });
    formDispatch({ field: "website", value: props.team.website });
    setHasPrefilledForm.on();
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
                onClick={setDeletingTeamAlertIsOpen.on}
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
                  <CharacterCounter
                    value={formState.description}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                  />
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
              {props.state === "edit" ? (
                <FormControl display="flex" alignItems="center">
                  <FormLabel
                    htmlFor="change-password"
                    mb="0"
                    fontSize="lg"
                    fontWeight="bold"
                  >
                    Change team join password?
                  </FormLabel>
                  <Switch
                    id="change-password"
                    isChecked={formState.changePassword}
                    onChange={(e) =>
                      formDispatch({
                        field: "changePassword",
                        value: e.target.checked,
                      })
                    }
                  />
                </FormControl>
              ) : null}
              <FormControl
                isRequired={
                  formState.changePassword || props.state === "create"
                }
                isInvalid={props.errors.password}
              >
                <FormLabel htmlFor="password" fontSize="lg" fontWeight="bold">
                  Join Password
                </FormLabel>
                <Input
                  id="password"
                  name="password"
                  type={isShowingPassword ? "text" : "password"}
                  placeholder="******************"
                  onChange={handleFieldChange}
                  value={formState.password}
                  size="lg"
                  disabled={props.state === "edit" && !formState.changePassword}
                />
                <Button
                  disabled={props.state === "edit" && !formState.changePassword}
                  onClick={setIsShowingPassword.toggle}
                  fontSize="sm"
                  fontStyle="italic"
                  variant="link"
                  fontWeight="normal"
                >
                  {isShowingPassword ? "Hide" : "Show"} password
                </Button>
                <FormErrorMessage>{props.errors.password}</FormErrorMessage>
              </FormControl>
            </Stack>
          </Card>
          {props.state === "edit" ? (
            <Stack as="section" pt={12} spacing={4}>
              <Heading as="h4" fontSize="xl">
                Team members
              </Heading>
              <UsersList
                team={props.team}
                users={props.teammates}
                roles={props.roles}
                state={props.state}
              />
            </Stack>
          ) : null}
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
          team={props.team}
          isOpen={isDeletingTeamAlertOpen}
          onClose={setDeletingTeamAlertIsOpen.off}
        />
      ) : null}
    </SiteLayout>
  );
};

////////////////////////////////////////////////////////////////////////////////
// UsersList

const UsersList = (props) => {
  const [isPromoteTeammateAlertOpen, setPromoteTeammateAlertIsOpen] =
    useBoolean();
  const [isDemoteTeammateAlertOpen, setDemoteTeammateAlertIsOpen] =
    useBoolean();
  const [isKickTeammateAlertOpen, setKickTeammateAlertIsOpen] = useBoolean();
  const [promotion, setPromotion] = React.useState("");
  const [teammateToEdit, setTeammateToEdit] = React.useState(null);

  const hasUsers = React.useMemo(() => {
    return Boolean(props.users) && props.users.length > 0;
  }, [props.users]);

  const TEAMMATE_OPTIONS = {
    PROMOTE_TO_LEADER: {
      props: {
        children: "Promote to Leader",
        icon: <FontAwesomeIcon icon={faCrown} />,
        onClick: (_user) => {
          setTeammateToEdit(_user);
          setPromotion("leader");
          setPromoteTeammateAlertIsOpen.on();
        },
      },
    },
    PROMOTE_TO_OFFICER: {
      props: {
        children: "Promote to Officer",
        icon: <FontAwesomeIcon icon={faMedal} />,
        onClick: (_user) => {
          setTeammateToEdit(_user);
          setPromotion("officer");
          setPromoteTeammateAlertIsOpen.on();
        },
      },
    },
    DEMOTE: {
      props: {
        children: "Demote",
        icon: <FontAwesomeIcon icon={faArrowCircleDown} />,
        onClick: (_user) => {
          setTeammateToEdit(_user);
          setDemoteTeammateAlertIsOpen.on();
        },
      },
    },
    KICK: {
      props: {
        children: "Kick from team",
        icon: <FontAwesomeIcon icon={faBan} />,
        color: "red.500",
        onClick: (_user) => {
          setTeammateToEdit(_user);
          setKickTeammateAlertIsOpen.on();
        },
      },
    },
  };

  if (hasUsers) {
    return (
      <React.Fragment>
        <List display="flex" flexWrap="wrap" mx={-2}>
          {props.users.map(({ user }) => {
            const isTeamLeader = props.team?.roles?.leader?.id === user.id;
            const isTeamOfficer = props.team?.roles?.officer?.id === user.id;
            const options = [];

            if (!isTeamLeader && !isTeamOfficer) {
              options.push(TEAMMATE_OPTIONS.PROMOTE_TO_LEADER);
              options.push(TEAMMATE_OPTIONS.PROMOTE_TO_OFFICER);
              options.push(TEAMMATE_OPTIONS.KICK);
            } else if (isTeamOfficer) {
              options.push(TEAMMATE_OPTIONS.PROMOTE_TO_LEADER);
              options.push(TEAMMATE_OPTIONS.DEMOTE);
              options.push(TEAMMATE_OPTIONS.KICK);
            }

            return (
              <UserListItem
                key={user.id}
                user={user}
                teamLeader={isTeamLeader}
                teamOfficer={isTeamOfficer}
                options={options}
              />
            );
          })}
        </List>

        {props.state === "edit" && Boolean(teammateToEdit) ? (
          <Portal>
            <KickTeammateDialog
              isOpen={isKickTeammateAlertOpen}
              onClose={setKickTeammateAlertIsOpen.off}
              teammate={teammateToEdit}
              team={props.team}
            />
            <PromoteTeammateDialog
              isOpen={isPromoteTeammateAlertOpen}
              onClose={setPromoteTeammateAlertIsOpen.off}
              teammate={teammateToEdit}
              team={props.team}
              promotion={promotion}
            />
            <DemoteTeammateDialog
              isOpen={isDemoteTeammateAlertOpen}
              onClose={setDemoteTeammateAlertIsOpen.off}
              teammate={teammateToEdit}
              team={props.team}
            />
          </Portal>
        ) : null}
      </React.Fragment>
    );
  }

  return <EmptyText mt={4}>This team currently has no users.</EmptyText>;
};

export default TeamForm;
