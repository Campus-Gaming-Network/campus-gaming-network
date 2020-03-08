import React from "react";
import { Redirect } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import xorBy from "lodash.xorby";
import omitBy from "lodash.omitby";
import isNil from "lodash.isnil";
// TODO: Replace moment with something smaller
import moment from "moment";
import {
  Input as ChakraInput,
  InputGroup as ChakraInputGroup,
  InputLeftAddon,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Select as ChakraSelect,
  Button as ChakraButton,
  Textarea,
  Heading,
  Text,
  Image,
  Tooltip,
  useToast
} from "@chakra-ui/core";
import * as constants from "../constants";
import { useFormFields } from "../utilities";
import { firebaseFirestore } from "../firebase";

const EditUser = props => {
  const [schools, setSchools] = React.useState([]);
  const [schoolOptions, setSchoolOptions] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const toast = useToast();
  const initialFormState = props.user
    ? {
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        school: props.user.school.id,
        status: props.user.status,
        major: props.user.major,
        minor: props.user.minor,
        bio: props.user.bio,
        hometown: props.user.hometown,
        birthdate: props.user.birthdate,
        website: props.user.website,
        twitter: props.user.twitter,
        twitch: props.user.twitch,
        youtube: props.user.youtube,
        skype: props.user.skype,
        discord: props.user.discord,
        battlenet: props.user.battlenet,
        steam: props.user.steam,
        xbox: props.user.xbox,
        psn: props.user.psn,
        favoriteGameSearch: "",
        currentGameSearch: ""
      }
    : {};
  const [fields, handleFieldChange] = useFormFields({ ...initialFormState });
  const testFavoriteGames = Array.from({ length: 1 }, () => ({
    id: Math.floor(Math.random() * 100),
    name: "League of Legends",
    picture: constants.TEST_VIDEO_GAME_COVER
  }));
  const testCurrentlyPlaying = Array.from({ length: 5 }, () => ({
    id: Math.floor(Math.random() * 100),
    name: "League of Legends",
    picture: constants.TEST_VIDEO_GAME_COVER
  }));

  const [favoriteGames, setFavoriteGames] = React.useState(testFavoriteGames);
  const [currentlyPlaying, setCurrentGames] = React.useState(
    testCurrentlyPlaying
  );

  // TODO: Impractical, we should use Algolia or ElasticSearch to query these
  // React.useEffect(() => {
  //   const loadSchools = async () => {
  //     firebaseFirestore.collection("schools")
  //       .get()
  //       .then(snapshot => {
  //         setSchools(snapshot.docs);
  //         setSchoolOptions(
  //           sortBy(
  //             snapshot.docs.map(doc => ({
  //               id: doc.id,
  //               ...doc.data()
  //             })),
  //             ["name"]
  //           )
  //         );
  //       });
  //   };

  //   loadSchools();
  // }, []);

  // React.useEffect(() => {
  //   if (user) {
  //     for (const key in user) {
  //       console.log(key);
  //       handleFieldChange({
  //         target: {
  //           id: key,
  //           value: user[key]
  //         }
  //       });
  //     }
  //   }
  // }, [user]);

  function toggleFavoriteGame(game) {
    setFavoriteGames(xorBy(favoriteGames, [game], "id"));
  }

  function toggleCurrentGame(game) {
    setCurrentGames(xorBy(currentlyPlaying, [game], "id"));
  }

  if (!props.isAuthenticated) {
    return <Redirect to="/" noThrow />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIsSubmitting(true);

    const data = {
      firstName: fields.firstName,
      lastName: fields.lastName,
      status: fields.status,
      hometown: fields.hometown,
      birthdate: new Date(moment(fields.birthdate)),
      major: fields.major,
      minor: fields.minor,
      bio: fields.bio,
      website: fields.website,
      twitter: fields.twitter,
      twitch: fields.twitch,
      youtube: fields.youtube,
      skype: fields.skype,
      discord: fields.discord,
      battlenet: fields.battlenet,
      steam: fields.steam,
      xbox: fields.xbox,
      psn: fields.psn
    };
    const matchedSchool = schools.find(school => school.id === fields.school);

    if (!!matchedSchool) {
      data.school = matchedSchool.ref;
    }

    const cleanedData = omitBy(data, isNil);

    firebaseFirestore
      .collection("users")
      .doc(props.user.ref.id)
      .update(cleanedData)
      .then(() => {
        setIsSubmitting(false);
        toast({
          title: "Profile updated.",
          description: "Your profile has been updated.",
          status: "success",
          isClosable: true
        });
      })
      .catch(error => {
        setIsSubmitting(false);
        toast({
          title: "An error occurred.",
          description: error,
          status: "error",
          isClosable: true
        });
      });
  }

  if (!props.user) {
    // TODO: Handle gracefully
    console.log("no user");
    return null;
  }

  if (!props.authenticatedUser) {
    // TODO: Handle gracefully
    console.log("no authenticated user");
    return null;
  }

  return (
    <Box as="article" my={16} px={8} mx="auto" fontSize="xl" maxW="4xl">
      <Stack as="form" spacing={32} onSubmit={handleSubmit}>
        <Heading as="h1" size="2xl">
          Your Profile
        </Heading>
        <ChakraButton
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          mt={-12}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Update Profile"}
        </ChakraButton>
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
            <Text color="gray.500">Personal information about you.</Text>
          </Box>
          <Stack spacing={6} p={8}>
            <FormControl isRequired>
              <FormLabel htmlFor="firstName" fontSize="lg" fontWeight="bold">
                First Name:
              </FormLabel>
              <ChakraInput
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Brandon"
                onChange={handleFieldChange}
                value={fields.firstName}
                size="lg"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="lastName" fontSize="lg" fontWeight="bold">
                Last Name:
              </FormLabel>
              <ChakraInput
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Sansone"
                onChange={handleFieldChange}
                value={fields.lastName}
                roundedLeft="0"
                size="lg"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email" fontSize="lg" fontWeight="bold">
                Email:
              </FormLabel>
              <ChakraInput
                id="email"
                name="email"
                type="email"
                placeholder="jdoe@gmail.com"
                value={props.authenticatedUser.email}
                size="lg"
                disabled
                aria-describedby="email-helper-text"
              />
              <FormHelperText id="email-helper-text">
                Your email cannot be changed.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="hometown" fontSize="lg" fontWeight="bold">
                Hometown:
              </FormLabel>
              <ChakraInput
                id="hometown"
                name="hometown"
                type="text"
                placeholder="Chicago, IL"
                onChange={handleFieldChange}
                value={fields.hometown}
                size="lg"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="birthdate" fontSize="lg" fontWeight="bold">
                Birthday:
              </FormLabel>
              <ChakraInput
                id="birthdate"
                name="birthdate"
                type="date"
                onChange={handleFieldChange}
                value={fields.birthdate}
                size="lg"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="bio" fontSize="lg" fontWeight="bold">
                Bio:
              </FormLabel>
              <Textarea
                id="bio"
                name="bio"
                onChange={handleFieldChange}
                value={fields.bio}
                placeholder="Add your bio"
                size="lg"
                resize="vertical"
                aria-describedby="bio-helper-text"
                maxLength="300"
                h="150px"
              />
              <FormHelperText id="bio-helper-text">
                Describe yourself in fewer than 300 characters.
              </FormHelperText>
            </FormControl>
          </Stack>
        </Box>
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
              School
            </Text>
            <Text color="gray.500">Where you study, what you study.</Text>
          </Box>
          <Stack spacing={6} p={8}>
            <FormControl>
              <FormLabel htmlFor="school" fontSize="lg" fontWeight="bold">
                School:
              </FormLabel>
              <ChakraSelect
                id="school"
                onChange={handleFieldChange}
                value={fields.school}
                size="lg"
              >
                <option value="">Select a school</option>
                {schoolOptions.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="status" fontSize="lg" fontWeight="bold">
                Status:
              </FormLabel>
              <ChakraSelect
                id="status"
                onChange={handleFieldChange}
                value={fields.status}
                size="lg"
              >
                {constants.STUDENT_STATUS_OPTIONS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </ChakraSelect>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="major" fontSize="lg" fontWeight="bold">
                Major:
              </FormLabel>
              <ChakraInput
                id="major"
                name="major"
                type="text"
                onChange={handleFieldChange}
                value={fields.major}
                size="lg"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="minor" fontSize="lg" fontWeight="bold">
                Minor:
              </FormLabel>
              <ChakraInput
                id="minor"
                name="minor"
                type="text"
                onChange={handleFieldChange}
                value={fields.minor}
                size="lg"
              />
            </FormControl>
          </Stack>
        </Box>
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
              Social Accounts
            </Text>
            <Text color="gray.500">
              Other places where people can find you at.
            </Text>
          </Box>
          <Stack spacing={6} p={8}>
            {Object.keys(constants.ACCOUNTS).map(id => {
              const account = constants.ACCOUNTS[id];

              return (
                <FormControl key={id}>
                  <FormLabel htmlFor={id} fontSize="lg" fontWeight="bold">
                    {account.label}:
                  </FormLabel>
                  <ChakraInputGroup size="lg">
                    {account.icon || !!account.url ? (
                      <InputLeftAddon
                        children={
                          <React.Fragment>
                            <FontAwesomeIcon icon={account.icon} />
                            {!!account.url ? (
                              <Text ml={4}>{account.url}</Text>
                            ) : null}
                          </React.Fragment>
                        }
                      />
                    ) : null}
                    <ChakraInput
                      id={id}
                      name={id}
                      type="text"
                      placeholder={account.placeholder}
                      onChange={handleFieldChange}
                      value={fields[id]}
                      roundedLeft="0"
                    />
                  </ChakraInputGroup>
                </FormControl>
              );
            })}
          </Stack>
        </Box>
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
              Favorite Games
            </Text>
            <Text color="gray.500">
              Your top 5 favorite games (if you can even choose).
            </Text>
          </Box>
          <Stack spacing={6} p={8}>
            <FormControl>
              <FormLabel
                htmlFor="favoriteGameSearch"
                fontSize="lg"
                fontWeight="bold"
              >
                Search for a game:
              </FormLabel>
              <ChakraInput
                id="favoriteGameSearch"
                name="favoriteGameSearch"
                type="text"
                onChange={handleFieldChange}
                value={fields.favoriteGameSearch}
                size="lg"
                disabled={favoriteGames.length === 5}
                placeholder="Search"
              />
            </FormControl>
            <Stack spacing={2}>
              <Text fontWeight="bold">
                Your favorites{" "}
                <Text
                  as="span"
                  color={`${favoriteGames.length === 5 ? "red" : undefined}`}
                >
                  ({favoriteGames.length}/5)
                </Text>
              </Text>
              :
              {favoriteGames.length === 0 ? (
                <Text color="gray.500">You haven’t selected any.</Text>
              ) : (
                <Stack isInline>
                  {favoriteGames.map(game => (
                    <Box key={game.id} w="100px" textAlign="center" mt={4}>
                      <Image
                        src={game.picture}
                        alt={`The cover art for ${game.name}`}
                      />
                      <Tooltip label={game.name}>
                        <Text fontSize="sm" lineHeight="1.2" p={2} isTruncated>
                          {game.name}
                        </Text>
                      </Tooltip>
                      <ChakraButton
                        size="xs"
                        variant="ghost"
                        variantColor="red"
                        onClick={() => toggleFavoriteGame(game)}
                      >
                        Remove
                      </ChakraButton>
                    </Box>
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Box>
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
              Currently Playing
            </Text>
            <Text color="gray.500">What are you currently playing? Max 5.</Text>
          </Box>
          <Stack spacing={6} p={8}>
            <FormControl>
              <FormLabel
                htmlFor="currentGameSearch"
                fontSize="lg"
                fontWeight="bold"
              >
                Search for a game:
              </FormLabel>
              <ChakraInput
                id="currentGameSearch"
                name="currentGameSearch"
                type="text"
                onChange={handleFieldChange}
                value={fields.currentGameSearch}
                size="lg"
                disabled={currentlyPlaying.length === 5}
                placeholder="Search"
              />
            </FormControl>
            <Stack spacing={2}>
              <Text fontWeight="bold">
                What you’re playing{" "}
                <Text
                  as="span"
                  color={`${
                    currentlyPlaying.length === 5 ? "red.500" : undefined
                  }`}
                >
                  ({currentlyPlaying.length}/5)
                </Text>
              </Text>
              {currentlyPlaying.length === 0 ? (
                <Text color="gray.500">You haven’t selected any.</Text>
              ) : (
                <Stack isInline spacing={12} wrap="wrap">
                  {currentlyPlaying.map(game => (
                    <Box key={game.id} w="100px" textAlign="center" mt={4}>
                      <Image
                        src={game.picture}
                        alt={`The cover art for ${game.name}`}
                      />
                      <Tooltip label={game.name}>
                        <Text fontSize="sm" lineHeight="1.2" p={2} isTruncated>
                          {game.name}
                        </Text>
                      </Tooltip>
                      <ChakraButton
                        size="xs"
                        variant="ghost"
                        variantColor="red"
                        onClick={() => toggleCurrentGame(game)}
                      >
                        Remove
                      </ChakraButton>
                    </Box>
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Box>
        <ChakraButton
          variantColor="purple"
          type="submit"
          size="lg"
          w="full"
          mt={-12}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Update Profile"}
        </ChakraButton>
      </Stack>
    </Box>
  );
};

export default EditUser;
