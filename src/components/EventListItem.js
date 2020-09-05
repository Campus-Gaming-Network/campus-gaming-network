import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Box, Text, Badge, Flex, Stack } from "@chakra-ui/core";
import startCase from "lodash.startcase";
import Link from "./Link";

const EventListItem = props => {
  if (!props.event || !props.school) {
    return null;
  }

  return (
    <Box as="li" flexBasis={{ md: "33.3333%", sm: "50%", xs: "100%" }} p={2}>
      <Box
        borderWidth="1px"
        rounded="lg"
        bg="white"
        w="100%"
        overflow="hidden"
        pos="relative"
      >
        <Stack p="4">
          <Box mr="auto">
            {props.event.hasEnded ? (
              <Badge
                mb={2}
                variantColor="red"
                fontSize="xs"
                textTransform="uppercase"
              >
                Event ended
              </Badge>
            ) : props.event.hasStarted ? (
              <Badge
                mb={2}
                variantColor="green"
                fontSize="xs"
                textTransform="uppercase"
                fontWeight="bold"
              >
                Happening now
              </Badge>
            ) : (
              <Badge
                as="time"
                dateTime={props.event.startDateTime.toDate()}
                mb={2}
                fontSize="xs"
                textTransform="uppercase"
              >
                {props.event.formattedStartDateTime}
              </Badge>
            )}
          </Box>
          <Link
            to={`/event/${props.event.id}`}
            color="purple.500"
            fontWeight="bold"
            fontSize="lg"
            isTruncated
            mt={-2}
          >
            {props.event.name}
          </Link>
          <Link
            to={`/school/${props.school.id}`}
            color="purple.500"
            fontSize="sm"
            fontWeight={600}
            isTruncated
            mt={-2}
          >
            {startCase(props.school.name.toLowerCase())}
          </Link>
          {props.event.isOnlineEvent ? (
            <Flex alignItems="center" color="gray.600">
              <Box color="gray.500" mb={1}>
                <FontAwesomeIcon icon={faGlobe} size="xs" />
              </Box>
              <Text ml={1} fontSize="xs" fontWeight={600}>
                Online event
              </Text>
            </Flex>
          ) : (
            <Flex alignItems="center" color="gray.600">
              <Box color="gray.500" mb={1}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size="xs" />
              </Box>
              <Text ml={1} fontSize="xs" fontWeight={600}>
                {props.event.location}
              </Text>
            </Flex>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default EventListItem;
