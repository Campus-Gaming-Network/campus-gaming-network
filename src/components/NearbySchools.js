import React from "react";
import { usePosition } from "use-position";
import {
  Heading,
  Text,
  Stack,
  List,
  Box,
  Flex,
  ListItem,
} from "@chakra-ui/react";
import { geohashQueryBounds, distanceBetween } from "geofire-common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import firebase from "src/firebase";
import SchoolLogo from "src/components/SchoolLogo";
import Link from "src/components/Link";
import Slider from "src/components/Slider";

import { mapSchool } from "src/utilities/school";

const NearbySchools = (props) => {
  const [schools, setSchools] = React.useState([]);
  const hasSchools = React.useMemo(
    () => Boolean(schools) && schools.length > 0,
    [schools]
  );
  const [fetched, setFetched] = React.useState(false);

  const fetchSchools = () => {
    const center = [props.latitude, props.longitude];
    const radiusInM = 5 * 1000;
    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];

    for (const b of bounds) {
      const q = firebase
        .firestore()
        .collection("schools")
        .where("geohash", "!=", "")
        .orderBy("geohash")
        .startAt(b[0])
        .endAt(b[1])
        .limit(25);
      promises.push(q.get());
    }

    Promise.all(promises)
      .then((snapshots) => {
        const matchingDocs = [];

        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            const { longitude, latitude } = doc.get("location");
            if (Boolean(latitude) && Boolean(longitude)) {
              const distanceInKm = distanceBetween(
                [latitude, longitude],
                center
              );
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= radiusInM) {
                matchingDocs.push(mapSchool(doc.data(), doc));
              }
            }
          }
        }

        return matchingDocs;
      })
      .then((matchingDocs) => {
        setSchools(matchingDocs);
      });
  };

  React.useEffect(() => {
    if (!fetched && Boolean(props.latitude) && Boolean(props.longitude)) {
      setFetched(true);
      fetchSchools();
    }
  }, [fetched, props.latitude, props.longitude]);

  if (typeof window !== "undefined") {
    return (
      <Box as="section" spacing={2} py={4}>
        <Heading as="h3" fontSize="xl" pb={4}>
          Nearby schools
        </Heading>
        {hasSchools ? (
          <React.Fragment>
            <Slider
              settings={{
                ...props.settings,
                className: schools.length < 5 ? "slick--less-slides" : "",
              }}
            >
              {schools.map((school) => {
                return (
                  <Box
                    key={school.id}
                    w={{ base: "100%", sm: "50%", md: "33.3333%", lg: "20%" }}
                  >
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
          </React.Fragment>
        ) : !(
            !fetched &&
            Boolean(props.latitude) &&
            Boolean(props.longitude)
          ) ? (
          <Text>Loading...</Text>
        ) : (
          <Text color="gray.400" fontSize="xl" fontWeight="600">
            There are no schools nearby
          </Text>
        )}
      </Box>
    );
  } else {
    return null;
  }
};

export default NearbySchools;
