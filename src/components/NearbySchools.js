import React from "react";
import LazyLoad from "react-lazyload";
import { Heading, Text, Stack, Box, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool } from "@fortawesome/free-solid-svg-icons";

// Components
import SchoolLogo from "src/components/SchoolLogo";
import Link from "src/components/Link";
import Slider from "src/components/Slider";
import SliderSilhouette from "src/components/silhouettes/SliderSilhouette";

import useFetchNearbySchools from "src/hooks/useFetchNearbySchools";

const NearbySchools = (props) => {
  const [schools, state] = useFetchNearbySchools(
    props.latitude,
    props.longitude
  );
  const hasSchools = React.useMemo(
    () => Boolean(schools) && schools.length > 0,
    [schools]
  );

  return (
    <LazyLoad once height={160}>
      {state === "idle" || state === "loading" ? (
        <SliderSilhouette />
      ) : (
        <Box as="section" py={4}>
          <Heading as="h3" fontSize="xl" pb={4}>
            Nearby schools
          </Heading>
          {!(state === "done" && hasSchools) ? (
            <Text color="gray.400" fontSize="xl" fontWeight="600">
              There are no schools nearby
            </Text>
          ) : (
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
          )}
        </Box>
      )}
    </LazyLoad>
  );
};

export default NearbySchools;
