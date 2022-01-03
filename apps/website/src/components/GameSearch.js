// Libraries
import React from 'react';
import { Flex, Text, Spinner, useBoolean } from '@chakra-ui/react';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox';
import uniqBy from 'lodash.uniqby';
import { httpsCallable } from 'firebase/functions';

// Components
import GameCover from 'src/components/GameCover';

// Hooks
import useDebounce from 'src/hooks/useDebounce';

// Constants
import { CALLABLES } from 'src/constants/firebase';

// Other
import { functions } from 'src/firebase';

const CACHED_GAMES = {};

////////////////////////////////////////////////////////////////////////////////
// GameSearch

const GameSearch = (props) => {
  const [searchTerm, setSearchTerm] = React.useState(props.gameName || '');
  const [isFetching, setIsFetching] = useBoolean();

  const handleChange = (event) => setSearchTerm(event.target.value);

  const debouncedGameSearch = useDebounce(searchTerm, 250);

  const useGameSearch = (debouncedGameSearch) => {
    const [games, setGames] = React.useState(null);

    React.useEffect(() => {
      const _debouncedGameSearch = debouncedGameSearch.trim();

      if (_debouncedGameSearch !== '' && _debouncedGameSearch.length > 2) {
        let isFresh = true;
        setIsFetching.on();

        fetchGames(debouncedGameSearch).then((games) => {
          if (isFresh) {
            setGames(games);
            setIsFetching.off();
          }
        });
        return () => (isFresh = false);
      }
    }, [debouncedGameSearch]);

    return games;
  };

  const fetchGames = (value) => {
    if (CACHED_GAMES[value]) {
      return Promise.resolve(CACHED_GAMES[value]);
    }

    const searchGames = httpsCallable(functions, CALLABLES.SEARCH_GAMES);

    return searchGames({ query: value }).then((result) => {
      CACHED_GAMES[value] = result.data.games;
      return result.data.games;
    });
  };

  const handleGameSelect = (selectedGame) => {
    const games = uniqBy(Object.values(CACHED_GAMES).flat(), 'id');
    const _selectedGame = games.find(
      (game) => game.name.toLowerCase().trim() === selectedGame.toLowerCase().trim(),
    ) || {
      name: selectedGame,
    };

    props.onSelect(_selectedGame);

    if (props.clearInputOnSelect) {
      setSearchTerm('');
    } else {
      setSearchTerm(selectedGame);
    }
  };

  const gamesResults = useGameSearch(debouncedGameSearch);

  return (
    <Combobox aria-label="Games" name={props.name || 'gameSearch'} onSelect={handleGameSelect}>
      <Flex align="center">
        <ComboboxInput
          id={props.id || 'gameSearch'}
          name={props.name || 'gameSearch'}
          placeholder={props.inputPlaceholder || 'Search'}
          onChange={handleChange}
          value={searchTerm}
          autocomplete={false}
          // This turns off the browser autocomplete
          autoComplete="off"
        />
        <Spinner visibility={isFetching ? 'visible' : 'hidden'} color="orange.500" ml={2} />
      </Flex>
      {Boolean(gamesResults) && Boolean(searchTerm) ? (
        <ComboboxPopover>
          {gamesResults.length > 0 ? (
            <ComboboxList>
              {gamesResults.map((game) => {
                return (
                  <ComboboxOption key={game.id} value={game.name}>
                    <Flex align="center">
                      <GameCover url={game.cover?.url || null} name={game.name} mr={2} h={12} w={12} shadow="none" />
                      <Text fontSize="lg">
                        <ComboboxOptionText />
                      </Text>
                    </Flex>
                  </ComboboxOption>
                );
              })}
            </ComboboxList>
          ) : (
            <Text as="span" d="block">
              No results found
            </Text>
          )}
        </ComboboxPopover>
      ) : null}
    </Combobox>
  );
};

export default GameSearch;
