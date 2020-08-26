import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import { Box, Text, Badge, Flex, Image, Tooltip } from "@chakra-ui/core";
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
        px={6}
        py={4}
        rounded="lg"
        bg="white"
        w="100%"
        overflow="hidden"
      >
        {props.event.isOnlineEvent ? <Badge mb={3}>Online Event</Badge> : null}
        <Box mb={3} display="flex" alignItems="center">
          <Box pr={2}>
            <Link
              to={`/event/${props.event.id}`}
              color="purple.500"
              fontWeight="bold"
              d="block"
              fontSize="xl"
              lineHeight="1.2"
              mb={2}
            >
              {props.event.name}
            </Link>
            <Link
              to={`/school/${props.school.id}`}
              color="purple.500"
              fontSize="sm"
              fontWeight={600}
              d="block"
              lineHeight="1.2"
            >
              {startCase(props.school.name.toLowerCase())}
            </Link>
          </Box>
          <Flex
            alignItems="center"
            justifyContent="center"
            color="gray.100"
            h={12}
            w={12}
            bg="gray.400"
            rounded="full"
            ml="auto"
          >
            <FontAwesomeIcon icon={faSchool} />
          </Flex>
        </Box>
        {props.event.hasEnded ? (
          <Badge
            variantColor="red"
            variant="subtle"
            px={2}
            rounded="full"
            mr="auto"
            mb={4}
            fontSize="sm"
          >
            Event Ended
          </Badge>
        ) : props.event.hasStarted ? (
          <Badge
            variantColor="green"
            variant="subtle"
            px={2}
            rounded="full"
            mr="auto"
            mb={4}
            fontSize="sm"
          >
            Happening Now
          </Badge>
        ) : (
          <Box d="block">
            <Text d="inline" mr={2} color="gray.500">
              <FontAwesomeIcon icon={faClock} />
            </Text>
            <Text
              as="time"
              fontSize="lg"
              dateTime={props.event.formattedStartDateTime}
            >
              {props.event.formattedStartDateTime}
            </Text>
          </Box>
        )}
        {props.event.game ? (
          <Box>
            {props.event.game &&
            props.event.game.cover &&
            props.event.game.cover.url ? (
              <Tooltip label={props.event.game.name}>
                <Image
                  src={props.event.game.cover.url}
                  rounded="full"
                  h={6}
                  w={6}
                  mr={2}
                />
              </Tooltip>
            ) : null}
          </Box>
        ) : null}
        {props.event.responses && props.event.responses.yes > 0 ? (
          <Box d="block">
            <Text fontSize="xs" textTransform="uppercase" fontWeight="bold">
              {props.event.responses.yes} Going
            </Text>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default EventListItem;
