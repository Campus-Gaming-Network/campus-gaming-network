// Libraries
import React from "react";
import { Heading, Text, Stack, Box, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import { usePosition } from "use-position";

// Components
import SchoolLogo from "src/components/SchoolLogo";
import Link from "src/components/Link";
import Slider from "src/components/Slider";
import EmptyText from "src/components/EmptyText";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";

// Hooks
import useFetchNearbySchools from "src/hooks/useFetchNearbySchools";
import useLocalStorage from "src/hooks/useLocalStorage";

// Constants
import { LOCAL_STORAGE } from "src/constants/other";

const NearbySchools = (props) => {
  const {
    latitude: browserLatitude,
    longitude: browserLongitude,
    error: geoPositionError,
  } = usePosition();
  const [
    localStorageGeolocation,
    setGeolocationInLocalStorage,
  ] = useLocalStorage(LOCAL_STORAGE.GEOLOCATION, null);
  const latitude = React.useMemo(() => {
    let _latitude = props.useBrowserLocation
      ? localStorageGeolocation?.browserLatitude || browserLatitude
      : props.latitude;
    // 3 decimal places because if the lat/long changes just slighlty after those decimals
    // we will request new data but the results wont be that different.
    _latitude = _latitude?.toFixed(3);
    return isNaN(_latitude) || !Boolean(_latitude)
      ? undefined
      : Number(_latitude);
  }, [
    props.latitude,
    localStorageGeolocation?.browserLatitude,
    browserLatitude,
  ]);
  const longitude = React.useMemo(() => {
    let _longitude = props.useBrowserLocation
      ? localStorageGeolocation?.browserLongitude || browserLongitude
      : props.longitude;
    // 3 decimal places because if the lat/long changes just slighlty after those decimals
    // we will request new data but the results wont be that different.
    _longitude = _longitude?.toFixed(3);
    return isNaN(_longitude) || !Boolean(_longitude)
      ? undefined
      : Number(_longitude);
  }, [
    props.longitude,
    localStorageGeolocation?.browserLongitude,
    browserLongitude,
  ]);
  const [schools, state] = useFetchNearbySchools(latitude, longitude);
  const hasSchools = React.useMemo(
    () => Boolean(schools) && schools.length > 0,
    [schools]
  );

  React.useEffect(() => {
    if (Boolean(localStorageGeolocation)) {
      if (
        (Boolean(browserLatitude) &&
          localStorageGeolocation.browserLatitude !== browserLatitude) ||
        (Boolean(browserLongitude) &&
          localStorageGeolocation.browserLongitude !== browserLongitude)
      ) {
        setGeolocationInLocalStorage({ browserLatitude, browserLongitude });
      }
    } else {
      setGeolocationInLocalStorage({ browserLatitude, browserLongitude });
    }
  }, [browserLatitude, browserLongitude]);

  if (state === "idle" || (props.useBrowserLocation && geoPositionError)) {
    return null;
  }

  return (
    <React.Fragment>
      {state === "loading" ? (
        <SliderSilhouette />
      ) : (
        <Box as="section" py={4}>
          <Heading as="h3" fontSize="xl" pb={4}>
            Nearby schools
          </Heading>
          {!(state === "done" && hasSchools) ? (
            <EmptyText>There are no schools nearby</EmptyText>
          ) : (
            <Slider
              settings={{
                ...props.settings,
                className: schools.length < 5 ? "slick--less-slides" : "",
              }}
            >
              {schools.map((school) => {
                return (
                  <Box key={school.id}>
                    <Flex
                      shadow="sm"
                      borderWidth={1}
                      rounded="lg"
                      bg="white"
                      pos="relative"
                      align="center"
                      mr={4}
                      mb={4}
                      p={4}
                      h={70}
                    >
                      <SchoolLogo
                        rounded="full"
                        bg="white"
                        shadow="sm"
                        borderWidth={2}
                        borderStyle="solid"
                        schoolId={school.id}
                        schoolName={school.formattedName}
                        h={4}
                        w={4}
                        htmlHeight={4}
                        htmlWidth={4}
                        mr={4}
                        fallback={
                          <Flex
                            rounded="full"
                            bg="white"
                            shadow="sm"
                            borderWidth={2}
                            alignItems="center"
                            justifyContent="center"
                            color="gray.600"
                            h={4}
                            w={4}
                            mr={4}
                          >
                            <FontAwesomeIcon icon={faSchool} size="sm" />
                          </Flex>
                        }
                      />
                      <Stack spacing={0}>
                        <Text
                          fontWeight={600}
                          color="gray.400"
                          fontSize="0.65rem"
                        >
                          {school.city}, {school.state}
                        </Text>
                        <Link
                          href={`/school/${school.id}`}
                          fontWeight="bold"
                          fontSize="sm"
                          lineHeight="1.2"
                          textAlign="left"
                          title={school.formattedName}
                          noOfLines={2}
                        >
                          {school.formattedName}
                        </Link>
                      </Stack>
                    </Flex>
                  </Box>
                );
              })}
            </Slider>
          )}
        </Box>
      )}
    </React.Fragment>
  );
};

export default NearbySchools;
