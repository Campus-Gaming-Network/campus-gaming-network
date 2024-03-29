// Libraries
import React from "react";
import startCase from "lodash.startcase";
import { useBoolean } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool, faHistory } from "@fortawesome/free-solid-svg-icons";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from "@reach/combobox";
import keyBy from "lodash.keyby";
import { httpsCallable } from "firebase/functions";

// Components
import SchoolLogo from "src/components/SchoolLogo";
import { Text, Spinner, Flex, Box } from "src/components/common";

// Hooks
import useLocalStorage from "src/hooks/useLocalStorage";
import useDebounce from "src/hooks/useDebounce";

// Utilities
import { mapSchool } from "src/utilities/school";

// Constants
import { CALLABLES } from "src/constants/firebase";
import { LOCAL_STORAGE } from "src/constants/other";

// Other
import { functions } from "src/firebase";

let savedSearches = [];

////////////////////////////////////////////////////////////////////////////////
// SchoolSearch

const SchoolSearch = (props) => {
  const [localStorageSchools, setSchoolsInLocalStorage] = useLocalStorage(
    LOCAL_STORAGE.SCHOOLS,
    null
  );
  const [localStorageSchoolQueries, setSchoolsQueryInLocalStorage] =
    useLocalStorage(LOCAL_STORAGE.SCHOOLS_QUERY, null);

  const [searchTerm, setSearchTerm] = React.useState(props.schoolName || "");
  const [isFetching, setIsFetching] = useBoolean();
  const [focused, setFocused] = useBoolean();
  const handleChange = (event) => setSearchTerm(event.target.value);

  const debouncedSchoolSearch = useDebounce(searchTerm, 250);

  const useSchoolSearch = (debouncedSchoolSearch) => {
    const [schools, setSchools] = React.useState(null);

    React.useEffect(() => {
      const _debouncedSchoolSearch = debouncedSchoolSearch.trim();

      if (_debouncedSchoolSearch !== "" && _debouncedSchoolSearch.length > 3) {
        let isFresh = true;
        setIsFetching.on();

        fetchSchools(debouncedSchoolSearch).then((schools) => {
          if (isFresh) {
            setSchools(schools);
            setIsFetching.off();
          }
        });
        return () => (isFresh = false);
      }
    }, [debouncedSchoolSearch]);

    return schools;
  };

  const fetchSchools = (searchTerm) => {
    const value = searchTerm?.trim().toLowerCase() || "";
    // const cachedQueryResults = localStorageSchoolQueries
    //   ? localStorageSchoolQueries[value]
    //   : null;

    // if (cachedQueryResults && cachedQueryResults.length > 0) {
    //   return Promise.resolve(
    //     Object.entries(localStorageSchools)
    //       .filter((entry) => cachedQueryResults.includes(entry[0]))
    //       .map((entry) => entry[1])
    //       .slice(0, 10)
    //   );
    // }

    const searchSchools = httpsCallable(functions, CALLABLES.SEARCH_SCHOOLS);

    return searchSchools({ query: value }).then((result) => {
      console.log({ value, result });
      if (Boolean(result?.data?.hits?.length)) {
        const mappedSchools = result.data.hits.map((hit) => mapSchool(hit));
        // const schools = {
        //   // ...localStorageSchools,
        //   ...keyBy(mappedSchools, "objectID"),
        // };

        // setSchoolsInLocalStorage(schools);
        // setSchoolsQueryInLocalStorage({
        //   ...localStorageSchoolQueries,
        //   [value]: result.data.hits.map((hit) => hit.objectID),
        // });

        return mappedSchools.slice(0, 10);
      }

      return [];
    });
  };

  const results = useSchoolSearch(debouncedSchoolSearch);

  const handleSchoolSelect = (selectedSchool) => {
    const [schoolName, location] = selectedSchool.split(" – ");
    const [city, state] = location.split(", ");
    const matchedSchool = results.find(
      (school) =>
        startCase(school.name.toLowerCase()) ===
          startCase(schoolName.toLowerCase()) &&
        school.city.toLowerCase() === city.toLowerCase() &&
        school.state.toLowerCase() === state.toLowerCase()
    );

    props.onSelect(matchedSchool);

    if (matchedSchool) {
      if (props.clearInputOnSelect) {
        setSearchTerm("");
      } else {
        setSearchTerm(selectedSchool);
      }

      if (savedSearches.length === 5) {
        savedSearches.pop();
      }

      savedSearches = savedSearches.filter(
        (school) => school.id !== matchedSchool.id
      );

      savedSearches.unshift({
        ...matchedSchool,
        savedSearch: true,
      });
    }
  };

  const items = React.useMemo(() => {
    if (!searchTerm && Boolean(savedSearches)) {
      return savedSearches;
    }

    return results;
  }, [searchTerm, results, savedSearches]);

  React.useEffect(() => {
    if (!props.withOverlay) {
      return;
    }

    const overlay = document.getElementsByClassName("overlay")[0];
    const isVisible = overlay
      ?.getAttribute("style")
      ?.includes("display: initial");

    if (focused) {
      if (!isVisible) {
        overlay.style.display = "initial";
      }
    } else if (isVisible) {
      overlay.style = null;
    }
  }, [props.withOverlay, focused]);

  return (
    <Combobox
      aria-label="School"
      name={props.name || "school"}
      onSelect={handleSchoolSelect}
      openOnFocus
    >
      <Flex align="center">
        <ComboboxInput
          id={props.id || "school"}
          name={props.name || "school"}
          placeholder={props.inputPlaceholder || "Search schools"}
          onChange={handleChange}
          value={searchTerm}
          autocomplete={false}
          // This turns off the browser autocomplete
          autoComplete="off"
          onFocus={setFocused.on}
          onBlur={setFocused.off}
        />
        <Spinner
          visibility={isFetching ? "visible" : "hidden"}
          color="orange.500"
          ml={2}
        />
      </Flex>
      {Boolean(items) && Boolean(searchTerm) ? (
        <ComboboxPopover id={`${props.id}--popover` || "school--popover"}>
          {items.length > 0 ? (
            <ComboboxList>
              {items.map((school) => {
                const value = `${startCase(
                  school.name.toLowerCase()
                )} – ${startCase(school.city.toLowerCase())}, ${school.state}`;

                return (
                  <ComboboxOption key={school.objectID} value={value}>
                    <Flex align="center">
                      <Box h={8} w={8} mr={2} rounded="full" bg="gray.100">
                        {school.savedSearch ? (
                          <Flex
                            align="center"
                            justify="center"
                            color="gray.400"
                            h={8}
                            w={8}
                            mr={2}
                          >
                            <FontAwesomeIcon icon={faHistory} />
                          </Flex>
                        ) : (
                          <SchoolLogo
                            schoolId={school.objectID}
                            schoolName={school.formattedName}
                            fallback={
                              <Flex
                                align="center"
                                justify="center"
                                color="gray.400"
                                h={8}
                                w={8}
                                mr={2}
                              >
                                <FontAwesomeIcon icon={faSchool} />
                              </Flex>
                            }
                          />
                        )}
                      </Box>
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

export default SchoolSearch;
