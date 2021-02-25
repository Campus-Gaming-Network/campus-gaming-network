import React from "react";
import { Text } from "@chakra-ui/react";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox";
import { functions } from "src/firebase";
import uniqBy from "lodash.uniqby";

// Hooks
import useDebounce from "src/hooks/useDebounce";

const CACHED_GAMES = {};

const GameSearch = props => {
  const [searchTerm, setSearchTerm] = React.useState(props.gameName || "");

  const handleChange = event => setSearchTerm(event.target.value);

  const debouncedGameSearch = useDebounce(searchTerm, 250);

  const useGameSearch = debouncedGameSearch => {
    const [games, setGames] = React.useState(null);

    React.useEffect(() => {
      const _debouncedGameSearch = debouncedGameSearch.trim();

      if (_debouncedGameSearch !== "" && _debouncedGameSearch.length > 2) {
        let isFresh = true;

        fetchGames(debouncedGameSearch).then(games => {
          if (isFresh) {
            setGames(games);
          }
        });
        return () => (isFresh = false);
      }
    }, [debouncedGameSearch]);

    return games;
  };

  const fetchGames = value => {
    if (CACHED_GAMES[value]) {
      return Promise.resolve(CACHED_GAMES[value]);
    }

    const searchGames = functions.httpsCallable("searchGames");

    return searchGames({ query: value }).then(result => {
      CACHED_GAMES[value] = result.data.games;
      return result.data.games;
    });
  };

  const handleGameSelect = selectedGame => {
    const games = uniqBy(Object.values(CACHED_GAMES).flat(), "id");
    const _selectedGame = games.find(
      game =>
        game.name.toLowerCase().trim() === selectedGame.toLowerCase().trim()
    ) || {
      name: selectedGame
    };

    props.onSelect(_selectedGame);

    if (props.clearInputOnSelect) {
      setSearchTerm("");
    } else {
      setSearchTerm(selectedGame);
    }
  };

  const gamesResults = useGameSearch(debouncedGameSearch);

  return (
    <Combobox
      aria-label="Games"
      name={props.name || "gameSearch"}
      onSelect={handleGameSelect}
    >
      <ComboboxInput
        id={props.id || "gameSearch"}
        name={props.name || "gameSearch"}
        placeholder={props.inputPlaceholder || "Search"}
        onChange={handleChange}
        value={searchTerm}
      />
      {gamesResults && (
        <ComboboxPopover>
          {gamesResults.length > 0 ? (
            <ComboboxList>
              {gamesResults.map(game => {
                return <ComboboxOption key={game.id} value={game.name} />;
              })}
            </ComboboxList>
          ) : (
            <Text as="span" ma={8} d="block">
              No results found
            </Text>
          )}
        </ComboboxPopover>
      )}
    </Combobox>
  );
};

export default GameSearch;
