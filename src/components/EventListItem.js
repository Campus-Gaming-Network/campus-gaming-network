import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import { Stack, Box, Text, Badge, Flex } from "@chakra-ui/core";
import startCase from "lodash.startcase";
import truncate from "lodash.truncate";
import * as constants from "../constants";
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
      <Stack spacing={4}>
        <Box display="flex" alignItems="center">
          <Box pr={2}>
            <Link
              to={`../../school/${props.school.id}`}
              className={`${constants.STYLES.LINK.DEFAULT} text-xl leading-none`}
            >
              {startCase(props.school.name.toLowerCase())}
            </Link>
            <Link
              to={`../../event/${props.event.id}`}
              className={`${constants.STYLES.LINK.DEFAULT} block font-semibold text-3xl mt-1 leading-none`}
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
            border="4px"
            borderColor="gray.300"
            ml="auto"
          >
            <FontAwesomeIcon icon={faSchool} />
          </Flex>
        </Box>
        <Box display="block">
          <FontAwesomeIcon icon={faClock} className="text-gray-700 mr-2" />
          <time
            className="text-lg"
            dateTime={props.event.formattedStartDateTime}
          >
            {props.event.formattedStartDateTime}
          </time>
        </Box>
        <Text fontSize="lg">
          {truncate(props.event.description, { length: 250 })}
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
              <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
              <Text>{props.event.responsesCount} Going</Text>
            </Box>
          </Badge>
        ) : null}
      </Stack>
    </Box>
  );
};

export default EventListItem;
