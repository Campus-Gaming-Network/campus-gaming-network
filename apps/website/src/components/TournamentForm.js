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
  Select,
  useBoolean,
  Checkbox,
  Radio,
  RadioGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Img,
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
import OutsideLink from "src/components/OutsideLink";

// Constants
import { MAX_DESCRIPTION_LENGTH } from "src/constants/event";
import { PRODUCTION_URL } from "src/constants/other";
import {
  TOURNAMENT_TYPE_OPTIONS,
  TOURNAMENT_FORMAT_OPTIONS,
  TOURNAMENT_RANK_BY_OPTIONS,
  DEFAULT_SWISS_PTS_FOR_MATCH_WIN,
  DEFAULT_SWISS_PTS_FOR_MATCH_TIE,
  DEFAULT_SWISS_PTS_FOR_GAME_WIN,
  DEFAULT_SWISS_PTS_FOR_GAME_TIE,
  DEFAULT_SWISS_PTS_FOR_BYE,
  DEFAULT_RR_PTS_FOR_MATCH_WIN,
  DEFAULT_RR_PTS_FOR_MATCH_TIE,
  DEFAULT_RR_PTS_FOR_GAME_WIN,
  DEFAULT_RR_PTS_FOR_GAME_TIE,
  GRAND_FINALS_MODIFIER_OPTIONS,
} from "src/constants/challonge";

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
  tournamentFormat: "single elimination",
  holdThirdPlaceMatch: false,
  grandFinalsModifier: "",
  rankedBy: "match wins",
  ptsForMatchWin: DEFAULT_SWISS_PTS_FOR_MATCH_WIN,
  ptsForMatchTie: DEFAULT_SWISS_PTS_FOR_MATCH_TIE,
  ptsForGameWin: DEFAULT_SWISS_PTS_FOR_GAME_WIN,
  ptsForGameTie: DEFAULT_SWISS_PTS_FOR_GAME_TIE,
  ptsForBye: DEFAULT_SWISS_PTS_FOR_BYE,
  rrPtsForMatchWin: DEFAULT_RR_PTS_FOR_MATCH_WIN,
  rrPtsForMatchTie: DEFAULT_RR_PTS_FOR_MATCH_TIE,
  rrPtsForGameWin: DEFAULT_RR_PTS_FOR_GAME_WIN,
  rrPtsForGameTie: DEFAULT_RR_PTS_FOR_GAME_TIE,
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
            <Box pb={12}>
              <PageHeading pb={4}>{pageTitle}</PageHeading>
              <Flex align="center">
                <Img
                  src="/challonge-logo.png"
                  alt="Challonge"
                  title="Challonge"
                  h={4}
                  mr={2}
                />
                <Text
                  fontSize="sm"
                  textTransform=""
                  fontWeight="bold"
                  color="gray.500"
                >
                  Powered by{" "}
                  <OutsideLink href="https://challonge.com/">
                    Challonge! &trade;
                  </OutsideLink>
                </Text>
              </Flex>
            </Box>
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
          <Box pt={16} />
          <Card as="fieldset" p={0} mb={32}>
            <Box pos="absolute" top="-5rem" px={{ base: 8, md: 0 }}>
              <Text as="legend" fontWeight="bold" fontSize="2xl">
                Basic Details
              </Text>
            </Box>
            <Stack spacing={6} p={8}>
              <FormControl isRequired isInvalid={props.errors.name}>
                <FormLabel htmlFor="name" fontSize="lg" fontWeight="bold">
                  Tournament Name
                </FormLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="CGN Summer Tournament"
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
          <Card as="fieldset" p={0} mb={32}>
            <Box pos="absolute" top="-5rem" px={{ base: 8, md: 0 }}>
              <Text as="legend" fontWeight="bold" fontSize="2xl">
                Tournament Details
              </Text>
            </Box>
            <Stack spacing={6} p={8}>
              <FormControl isRequired isInvalid={props.errors.tournamentFormat}>
                <FormLabel
                  htmlFor="tournamentFormat"
                  fontSize="lg"
                  fontWeight="bold"
                >
                  Tournament Format
                </FormLabel>
                <Select
                  id="tournamentFormat"
                  name="tournamentFormat"
                  onChange={handleFieldChange}
                  value={formState.tournamentFormat}
                  size="lg"
                >
                  {TOURNAMENT_FORMAT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {props.errors.tournamentFormat}
                </FormErrorMessage>
              </FormControl>
              {formState.tournamentFormat === "single elimination" ? (
                <SingleEliminationFormat />
              ) : null}
              {formState.tournamentFormat === "double elimination" ? (
                <DoubleEliminationFormat />
              ) : null}
              {formState.tournamentFormat === "round robin" ? (
                <RoundRobinFormat />
              ) : null}
              {formState.tournamentFormat === "swiss" ? <SwissFormat /> : null}
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

const SingleEliminationFormat = () => {
  return (
    <React.Fragment>
      <FormControl isRequired>
        <Checkbox
          id="holdThirdPlaceMatch"
          name="holdThirdPlaceMatch"
          // onChange={handleFieldChange}
          //   value={formState.tournamentFormat}
          size="lg"
        >
          Include a match for 3rd place.
        </Checkbox>
        {/* <FormErrorMessage>{props.errors.holdThirdPlaceMatch}</FormErrorMessage> */}
      </FormControl>
    </React.Fragment>
  );
};

const DoubleEliminationFormat = () => {
  return (
    <React.Fragment>
      <FormControl>
        <FormLabel
          htmlFor="grandFinalsModifier"
          fontSize="lg"
          fontWeight="bold"
        >
          Grand Finals
        </FormLabel>
        <RadioGroup
          id="grandFinalsModifier"
          name="grandFinalsModifier"
          // onChange={handleFieldChange}
          // value={formState.grandFinalsModifier}
        >
          <Stack>
            {GRAND_FINALS_MODIFIER_OPTIONS.map((option) => (
              <Radio value={option.value}>{option.label}</Radio>
            ))}
          </Stack>
        </RadioGroup>
        {/* <FormErrorMessage>{props.errors.grandFinalsModifier}</FormErrorMessage> */}
      </FormControl>
    </React.Fragment>
  );
};

const RoundRobinFormat = () => {
  const POINT_INPUT_OPTIONS = [
    {
      id: "rrPtsForMatchWin",
      label: "Points Per Match Win",
      defaultValue: DEFAULT_RR_PTS_FOR_MATCH_WIN,
    },
    {
      id: "rrPtsForMatchTie",
      label: "Points Per Match Tie",
      defaultValue: DEFAULT_RR_PTS_FOR_MATCH_TIE,
    },
    {
      id: "rrPtsForGameWin",
      label: "Points Per Game/Set Win",
      defaultValue: DEFAULT_RR_PTS_FOR_GAME_WIN,
    },
    {
      id: "rrPtsForGameTie",
      label: "Points Per Game/Set Tie",
      defaultValue: DEFAULT_RR_PTS_FOR_GAME_TIE,
    },
  ];

  return (
    <React.Fragment>
      <FormControl>
        <FormLabel htmlFor="rankedBy" fontSize="lg" fontWeight="bold">
          Rank by
        </FormLabel>
        <Select
          id="rankedBy"
          name="rankedBy"
          // onChange={handleFieldChange}
          // value={formState.rankedBy}
          size="lg"
        >
          {TOURNAMENT_RANK_BY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {/* <FormErrorMessage>{props.errors.rankedBy}</FormErrorMessage> */}
      </FormControl>
      {POINT_INPUT_OPTIONS.map((option) => (
        <FormControl
          d="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <FormLabel htmlFor={option.id} fontSize="lg" fontWeight="bold">
            {option.label}
          </FormLabel>
          <NumberInput
            defaultValue={option.defaultValue}
            precision={2}
            step={0.25}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      ))}
    </React.Fragment>
  );
};

const SwissFormat = () => {
  const POINT_INPUT_OPTIONS = [
    {
      id: "ptsForMatchWin",
      label: "Points Per Match Win",
      defaultValue: DEFAULT_SWISS_PTS_FOR_MATCH_WIN,
    },
    {
      id: "ptsForMatchTie",
      label: "Points Per Match Tie",
      defaultValue: DEFAULT_SWISS_PTS_FOR_MATCH_TIE,
    },
    {
      id: "ptsForGameWin",
      label: "Points Per Game/Set Win",
      defaultValue: DEFAULT_SWISS_PTS_FOR_GAME_WIN,
    },
    {
      id: "ptsForGameTie",
      label: "Points Per Game/Set Tie",
      defaultValue: DEFAULT_SWISS_PTS_FOR_GAME_TIE,
    },
    {
      id: "ptsForBye",
      label: "Points Per Bye",
      defaultValue: DEFAULT_SWISS_PTS_FOR_BYE,
    },
  ];

  return (
    <React.Fragment>
      {POINT_INPUT_OPTIONS.map((option) => (
        <FormControl
          d="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <FormLabel htmlFor={option.id} fontSize="lg" fontWeight="bold">
            {option.label}
          </FormLabel>
          <NumberInput
            defaultValue={option.defaultValue}
            precision={2}
            step={0.25}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      ))}
    </React.Fragment>
  );
};

export default TournamentForm;
