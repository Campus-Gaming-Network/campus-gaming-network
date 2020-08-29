import React from "react";
import startCase from "lodash.startcase";
import { Text } from "@chakra-ui/core";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from "@reach/combobox";
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from "workerize-loader!../workers";

import { useAppState } from "../store";

const CACHED_SCHOOLS = {};

const workerInstance = worker();

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
  const [results, setResults] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState(props.schoolName || "");

  const handleChange = event => setSearchTerm(event.target.value);

  const getSchools = React.useCallback(async () => {
    const value = searchTerm ? searchTerm.trim().toLowerCase() : "";

    if (CACHED_SCHOOLS[value]) {
      setResults(CACHED_SCHOOLS[value]);
    } else {
      let schools = await workerInstance.getSchools(value, schoolOptions);

      if (schools) {
        schools = schools.slice(0, 10);
      }

      CACHED_SCHOOLS[value] = [...schools];
      setResults(schools);
    }
  }, [searchTerm, schoolOptions]);

  React.useEffect(() => {
    getSchools();
  }, [getSchools]);

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

  return (
    <Combobox aria-label="School" name="school" onSelect={handleSchoolSelect}>
      <ComboboxInput
        id={props.id || "school"}
        name={props.name || "school"}
        placeholder={props.inputPlaceholder || "Search schools"}
        onChange={handleChange}
        value={searchTerm}
        disabled={!schoolOptions || !schoolOptions.length}
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
