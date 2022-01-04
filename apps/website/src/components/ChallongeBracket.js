// Libraries
import React from 'react';
import isNil from 'lodash.isnil';

// Constants
import { CHALLONGE_URL, BRACKET_URL_PARAMS } from 'src/constants/challonge';

// Options
// OPTION --- RANGE --- DEFAULT
// multiplier --- 0.3-3.0 --- 1.0
// match_with_multiplier --- 0.5-3.0 --- 1.0
// scale_to_fit --- 0/1 --- 0
// show_tournament_name --- 0/1 --- 0
// show_final_results --- 0/1 --- 0
// show_standings --- 0/1 --- 0
// show_voting --- 0/1 --- 0
// show_live_status --- 0/1 --- 0
// tab --- "groups","final","standings"

////////////////////////////////////////////////////////////////////////////////
// ChallongeBracket

const ChallongeBracket = ({
  id,
  multiplier,
  match_with_multiplier,
  scale_to_fit,
  show_tournament_name,
  show_final_results,
  show_standings,
  show_voting,
  show_live_status,
  tab,
  ...rest
}) => {
  const url = React.useMemo(() => {
    const _url = new URL(`${CHALLONGE_URL}/${id}/module`);
    const urlParams = _url.searchParams;

    BRACKET_URL_PARAMS.forEach((_param) => {
      if (!isNil(param)) {
        urlParams.set(_param, param);
      }
    });

    _url.search = urlParams.toString();

    return _url.toString();
  }, [
    id,
    multiplier,
    match_with_multiplier,
    scale_to_fit,
    show_tournament_name,
    show_final_results,
    show_standings,
    show_voting,
    show_live_status,
    tab,
  ]);
  return (
    <iframe src={url} width="100%" height="500" frameBorder="0" scrolling="auto" allowTransparency="true" {...rest} />
  );
};

export default ChallongeBracket;
