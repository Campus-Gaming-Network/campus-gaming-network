export const CHALLONGE_API_URL: string = 'https://api.challonge.com/v1/';

interface ChallongeParams {
  TOURNAMENT: {
    CREATE: {
      API_KEY: string;
      NAME: string;
      TOURNAMENT_TYPE: string;
      URL: string;
      SUBDOMAIN: string;
      DESCRIPTION: string;
      OPEN_SIGNUP: string;
      HOLD_THIRD_PLACE_MATCH: string;
      PTS_FOR_MATCH_WIN: string;
      PTS_FOR_MATCH_TIE: string;
      PTS_FOR_GAME_WIN: string;
      PTS_FOR_GAME_TIE: string;
      PTS_FOR_BYE: string;
      SWISS_ROUNDS: string;
      RANKED_BY: string;
      RR_PTS_FOR_MATCH_WIN: string;
      RR_PTS_FOR_MATCH_TIE: string;
      RR_PTS_FOR_GAME_WIN: string;
      RR_PTS_FOR_GAME_TIE: string;
      ACCEPT_ATTACHMENTS: string;
      HIDE_FORUM: string;
      SHOW_ROUNDS: string;
      PRIVATE: string;
      NOTIFY_USERS_WHEN_MATCHES_OPEN: string;
      NOTIFY_USERS_WHEN_THE_TOURNAMENT_ENDS: string;
      SEQUENTIAL_PAIRINGS: string;
      SIGNUP_CAP: string;
      START_AT: string;
      CHECK_IN_DURATION: string;
      GRAND_FINALS_MODIFIER: string;
    };
  };
  PARTICIPANT: {
    CREATE: {
      API_KEY: string;
      TOURNAMENT: string;
      NAME: string;
      CHALLONGE_USERNAME: string;
      EMAIL: string;
      SEED: string;
      MISC: string;
    };
  };
}
export const CHALLONGE_PARAMS: ChallongeParams = {
  TOURNAMENT: {
    CREATE: {
      API_KEY: 'api_key',
      NAME: 'name',
      TOURNAMENT_TYPE: 'tournament_type',
      URL: 'url',
      SUBDOMAIN: 'subdomain',
      DESCRIPTION: 'description',
      OPEN_SIGNUP: 'open_signup',
      HOLD_THIRD_PLACE_MATCH: 'hold_third_place_match',
      PTS_FOR_MATCH_WIN: 'pts_for_match_win',
      PTS_FOR_MATCH_TIE: 'pts_for_match_tie',
      PTS_FOR_GAME_WIN: 'pts_for_game_win',
      PTS_FOR_GAME_TIE: 'pts_for_game_tie',
      PTS_FOR_BYE: 'pts_for_bye',
      SWISS_ROUNDS: 'swiss_rounds',
      RANKED_BY: 'ranked_by',
      RR_PTS_FOR_MATCH_WIN: 'rr_pts_for_match_win',
      RR_PTS_FOR_MATCH_TIE: 'rr_pts_for_match_tie',
      RR_PTS_FOR_GAME_WIN: 'rr_pts_for_game_win',
      RR_PTS_FOR_GAME_TIE: 'rr_pts_for_game_tie',
      ACCEPT_ATTACHMENTS: 'accept_attachments',
      HIDE_FORUM: 'hide_forum',
      SHOW_ROUNDS: 'show_rounds',
      PRIVATE: 'private',
      NOTIFY_USERS_WHEN_MATCHES_OPEN: 'notify_users_when_matches_open',
      NOTIFY_USERS_WHEN_THE_TOURNAMENT_ENDS: 'notify_users_when_the_tournament_ends',
      SEQUENTIAL_PAIRINGS: 'sequential_pairings',
      SIGNUP_CAP: 'signup_cap',
      START_AT: 'start_at',
      CHECK_IN_DURATION: 'check_in_duration',
      GRAND_FINALS_MODIFIER: 'grand_finals_modifier',
    },
  },
  PARTICIPANT: {
    CREATE: {
      API_KEY: 'api_key',
      TOURNAMENT: 'tournament',
      NAME: 'name',
      CHALLONGE_USERNAME: 'challonge_username',
      EMAIL: 'email',
      SEED: 'seed',
      MISC: 'misc',
    },
  },
};
