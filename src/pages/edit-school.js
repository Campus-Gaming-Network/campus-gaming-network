import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Input as ChakraInput,
  Stack,
  FormControl,
  FormLabel,
  Box,
  Button as ChakraButton,
  Textarea,
  Heading,
  Text,
  Spinner
} from "@chakra-ui/core";
import PlacesAutocomplete from "react-places-autocomplete";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useFormFields } from "../utilities";
import { geocodeByAddress } from "react-places-autocomplete/dist/utils";

const db = firebase.firestore();

const EditSchool = props => {
  const [fields, handleFieldChange] = useFormFields({
    description: "",
    email: "",
    website: ""
  });
  const [locationSearch, setLocationSearch] = React.useState("");
  const [placeId, setPlaceId] = React.useState("");

  // if (!props.isAuthenticated) {
  //   return <Redirect to="/" noThrow />;
  // }

  // const user = TEST_DATA.users.find(user => user.id === props.id);

  // if (!user) {
  //   // TODO: Handle gracefully
  //   console.log("no user");
  //   return null;
  // }

  function setLocation(address, placeId) {
    setLocationSearch(address);
    setPlaceId(placeId);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Double check the address for a geocode if they blur or something
    // Probably want to save the address and lat/long
    // If we save the placeId, it may be easier to render the map for that place
    geocodeByAddress(locationSearch)
      .then(results => console.log({ results }))
      .catch(error => console.error({ error }));

    const data = {
      ...fields,
      ...{
        locationSearch,
        placeId
      }
    };

    console.log(data);
  }

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
      <Stack as="form" spacing={32} onSubmit={handleSubmit}>
        <Heading as="h1" size="2xl">
          Edit School
        </Heading>
        <Box
          as="fieldset"
          borderWidth="1px"
          boxShadow="lg"
          rounded="lg"
          bg="white"
          pos="relative"
        >
          <Box pos="absolute" top="-5rem">
            <Text as="legend" fontWeight="bold" fontSize="2xl">
              Details
            </Text>
            <Text color="gray.500">Information about the school.</Text>
          </Box>
          <Stack spacing={6} p={8}>
            <FormControl>
              <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
                Contact email:
              </FormLabel>
              <ChakraInput
                id="email"
                name="email"
                type="email"
                placeholder="esports@school.edu"
                onChange={handleFieldChange}
                value={fields.email}
                size="lg"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="location" fontSize="lg" fontWeight="bold">
                Location:
              </FormLabel>
              <Stack>
                <PlacesAutocomplete
                  value={locationSearch}
                  onChange={value => setLocationSearch(value)}
                  onSelect={(address, placeId) => setLocation(address, placeId)}
                  debounce={600}
                  shouldFetchSuggestions={locationSearch.length >= 3}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading
                  }) => (
                    <div>
                      <ChakraInput
                        {...getInputProps({
                          placeholder: "Where is the school located?",
                          className: "location-search-input"
                        })}
                        size="lg"
                      />
                      <Box className="autocomplete-dropdown-container">
                        {loading && (
                          <Box w="100%" textAlign="center">
                            <Spinner
                              thickness="4px"
                              speed="0.65s"
                              emptyColor="gray.200"
                              color="purple.500"
                              size="xl"
                              mt={4}
                            />
                          </Box>
                        )}
                        {suggestions.map((suggestion, index, arr) => {
                          const isLast = arr.length - 1 === index;
                          const style = {
                            backgroundColor: suggestion.active
                              ? "#edf2f7"
                              : "#ffffff",
                            cursor: "pointer",
                            padding: "12px",
                            borderLeft: "1px solid #e2e8f0",
                            borderRight: "1px solid #e2e8f0",
                            borderBottom: isLast
                              ? "1px solid #e2e8f0"
                              : undefined,
                            borderBottomLeftRadius: "0.25rem",
                            borderBottomRightRadius: "0.25rem"
                          };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                style
                              })}
                            >
                              <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                className="mr-4"
                              />
                              <Text as="span">{suggestion.description}</Text>
                            </div>
                          );
                        })}
                      </Box>
                    </div>
                  )}
                </PlacesAutocomplete>
              </Stack>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="Description" fontSize="lg" fontWeight="bold">
                Description:
              </FormLabel>
              <Textarea
                id="Description"
                name="Description"
                onChange={handleFieldChange}
                value={fields.Description}
                placeholder="Write a little something about the school"
                size="lg"
                resize="vertical"
                maxLength="300"
                h="150px"
              />
            </FormControl>
          </Stack>
        </Box>
        <ChakraButton
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          mt={-12}
        >
          Update School
        </ChakraButton>
      </Stack>
    </Box>
  );
};

export default EditSchool;
