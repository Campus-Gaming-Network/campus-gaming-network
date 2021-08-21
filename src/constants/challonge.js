////////////////////////////////////////////////////////////////////////////////
// Challonge Constants

const TOURNAMENT_TYPE_OPTIONS = [
  { label: "Single Stage Tournament", value: "single stage" },
  { label: "Two Stage Tournament", value: "two stage" },
];
const TOURNAMENT_FORMAT_OPTIONS = [
  { label: "Single Elimination", value: "single elimination" },
  { label: "Double Elimination", value: "double elimination" },
  { label: "Round Robin", value: "round robin" },
  { label: "Swiss", value: "swiss" },
  { label: "Free For All", value: "free for all" },
];
const TOURNAMENT_RANK_BY_OPTIONS = [
  { label: "Match Wins", value: "match wins" },
  { label: "Game/Set Wins", value: "game wins" },
  { label: "Points Scored", value: "points scored" },
  { label: "Points Difference", value: "points difference" },
  { label: "Custom (points system)", value: "custom" },
];
const DEFAULT_SWISS_PTS_FOR_MATCH_WIN = "1.0";
const DEFAULT_SWISS_PTS_FOR_MATCH_TIE = "0.5";
const DEFAULT_SWISS_PTS_FOR_GAME_WIN = "0.0";
const DEFAULT_SWISS_PTS_FOR_GAME_TIE = "0.0";
const DEFAULT_SWISS_PTS_FOR_BYE = "1.0";
const DEFAULT_RR_PTS_FOR_MATCH_WIN = "1.0";
const DEFAULT_RR_PTS_FOR_MATCH_TIE = "0.5";
const DEFAULT_RR_PTS_FOR_GAME_WIN = "0.0";
const DEFAULT_RR_PTS_FOR_GAME_WIN = "0.0";
const GRAND_FINALS_MODIFIER_OPTIONS = [
  {
    label:
      "1-2 matches — winners bracket finalist has to be defeated twice by the losers bracket finalist",
    value: "",
  },
  { label: "1 match", value: "single match" },
  { label: "None", value: "skip" },
];
