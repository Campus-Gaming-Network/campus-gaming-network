import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faSchool, faBolt, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { Stack, Box, Text, Badge, Flex, Image, Tooltip } from "@chakra-ui/core";
import startCase from "lodash.startcase";
import truncate from "lodash.truncate";
import Link from "./Link";

const EventListItem = props => {
  if (!props.event || !props.school) {
    return null;
  }

  return (
    <Box
      as="li"
      borderWidth="1px"
      boxShadow="lg"
      rounded="lg"
      bg="white"
      pos="relative"
      mt={4}
      py={6}
      px={8}
      display="flex"
      alignItems="center"
    >
      <Stack spacing={4} w="100%">
        <Box display="flex" alignItems="center">
          <Box pr={2}>
            <Link
              to={`../../school/${props.school.id}`}
              color="purple.500"
              fontSize="xl"
              fontWeight={600}
            >
              {startCase(props.school.name.toLowerCase())}
            </Link>
            <Link
              to={`../../event/${props.event.id}`}
              color="purple.500"
              fontWeight="bold"
              d="block"
              mt={1}
              fontSize="3xl"
            >
              {props.event.name}
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
          <Flex
            alignItems="center"
            justifyContent="flex-start"
            mr="auto"
            px={4}
            bg="red.100"
            rounded="lg"
          >
            <Text
              as="span"
              fontSize="lg"
              color="red.500"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Event Ended
            </Text>
          </Flex>
        ) : props.event.hasStarted ? (
          <Flex
            alignItems="center"
            justifyContent="flex-start"
            mr="auto"
            px={4}
            bg="green.100"
            rounded="lg"
          >
            <Text mr={2} color="green.600">
              <FontAwesomeIcon size="xs" icon={faBolt} className="pulse" />
            </Text>
            <Text
              as="span"
              fontSize="lg"
              color="green.500"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Happening now
            </Text>
          </Flex>
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
          <Flex align="center">
            {props.event.game &&
            props.event.game.cover &&
            props.event.game.cover.url ? (
              <Image
                src={props.event.game.cover.url}
                rounded="md"
                shadow="md"
                h={10}
                w={10}
                mr={2}
              />
            ) : (
              <Box mr={2}>
                <FontAwesomeIcon icon={faGamepad} />
              </Box>
            )}
            <Text as="span">{props.event.game.name}</Text>
          </Flex>
        ) : null}
        <Text fontSize="lg">
          {props.event.description.length >= 250 ? (
            <Tooltip label={props.event.description}>
              {truncate(props.event.description, { length: 250 })}
            </Tooltip>
          ) : (
            props.event.description
          )}
        </Text>
        {props.event.responsesCount ? (
          <Badge
            variantColor="gray"
            variant="subtle"
            px={2}
            py={1}
            rounded="full"
            mr="auto"
          >
            <Box display="flex" alignItems="center">
              <Box mr={2}>
                <FontAwesomeIcon icon={faUserFriends} />
              </Box>
              <Text>{props.event.responsesCount} Going</Text>
            </Box>
          </Badge>
        ) : null}
      </Stack>
    </Box>
  );
};

export default EventListItem;
