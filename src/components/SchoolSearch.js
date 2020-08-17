import React from "react";
import matchSorter from "match-sorter";
import startCase from "lodash.startcase";
import { Text } from "@chakra-ui/core";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox";

import { useAppState } from "../store";
import useThrottle from "../hooks/useThrottle";

const CACHED_SCHOOLS = {};

const SchoolSearch = props => {
  const state = useAppState();
  const schoolOptions = React.useMemo(
    () =>
      Object.values(state.schools).map(school => ({
        id: school.id,
        name: startCase(school.name.toLowerCase()),
        city: startCase(school.city.toLowerCase()),
        state: school.state
      })),
    [state.schools]
  );

  const [searchTerm, setSearchTerm] = React.useState(props.schoolName || "");

  const handleChange = event => setSearchTerm(event.target.value);

  const matchSchool = value => {
    const _value = value.trim().toLowerCase();

    if (CACHED_SCHOOLS[_value]) {
      return CACHED_SCHOOLS[_value];
    }

    let results = matchSorter(schoolOptions, _value, { keys: ["name"] });

    if (results) {
      results = results.slice(0, 10);
    }

    CACHED_SCHOOLS[_value] = [...results];

    return results;
  };

  const useSchoolMatch = searchTerm => {
    const throttledTerm = useThrottle(searchTerm, 100);
    const results = React.useMemo(
      () =>
        throttledTerm.trim() === "" || throttledTerm.trim().length < 3
          ? null
          : matchSchool(throttledTerm),
      [throttledTerm]
    );
    return results;
  };

  const handleSchoolSelect = selectedSchool => {
    const [schoolName, location] = selectedSchool.split(" – ");
    const [city, state] = location.split(", ");
    const matchedSchool = schoolOptions.find(
      school =>
        school.name.toLowerCase() === schoolName.toLowerCase() &&
        school.city.toLowerCase() === city.toLowerCase() &&
        school.state.toLowerCase() === state.toLowerCase()
    );

    props.onSelect(matchedSchool);

    if (matchedSchool) {
      setSearchTerm(selectedSchool);
    }
  };

  const results = useSchoolMatch(searchTerm);

  if (!schoolOptions || !schoolOptions.length) {
    return null;
  }

  return (
    <Combobox aria-label="School" name="school" onSelect={handleSchoolSelect}>
      <ComboboxInput
        id={props.id || "school"}
        name={props.name || "school"}
        placeholder={props.inputPlaceholder || "Search schools"}
        onChange={handleChange}
        value={searchTerm}
      />
      {results && (
        <ComboboxPopover>
          {results.length > 0 ? (
            <ComboboxList>
              {results.map(school => {
                return (
                  <ComboboxOption
                    key={school.id}
                    value={`${school.name} – ${school.city}, ${school.state}`}
                  />
                );
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

export default SchoolSearch;
