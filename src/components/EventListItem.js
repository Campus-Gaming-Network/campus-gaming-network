import React from "react";
import { Box, Text, Flex, Stack } from "@chakra-ui/react";
import startCase from "lodash.startcase";
import Link from "./Link";

const EventListItem = props => {
  if (!props.event || !props.school) {
    return null;
  }

  return (
    <Box
      as="li"
      flexBasis={{ md: "33.3333%", sm: "100%" }}
      minWidth={{ md: "33.3333%", sm: "100%" }}
      flexGrow={0}
      p={2}
    >
      <Box
        borderWidth={1}
        rounded="lg"
        bg="white"
        w="100%"
        overflow="hidden"
        pos="relative"
        shadow="sm"
      >
        <Stack px={4} pt={2} pb={3}>
          <Box mr="auto">
            {props.event.hasEnded ? (
              <Text
                d="inline-block"
                color="red.400"
                fontSize="md"
                textTransform="uppercase"
                fontWeight="bold"
                lineHeight="none"
                isTruncated
              >
                Event ended
              </Text>
            ) : props.event.hasStarted ? (
              <Text
                d="inline-block"
                color="green.400"
                fontSize="md"
                textTransform="uppercase"
                fontWeight="bold"
                lineHeight="none"
                isTruncated
              >
                Happening now
              </Text>
            ) : (
              <Text
                d="inline-block"
                as="time"
                dateTime={props.event.startDateTime.toDate()}
                title={props.event.startDateTime.toDate()}
                fontSize="md"
                textTransform="uppercase"
                fontWeight="bold"
                lineHeight="none"
                isTruncated
              >
                {props.event.formattedStartDateTime}
              </Text>
            )}
          </Box>
          <Link
            to={`/event/${props.event.id}`}
            color="orange.500"
            fontWeight="bold"
            fontSize="3xl"
            isTruncated
            lineHeight="short"
            mt={-2}
            title={props.event.name}
          >
            {props.event.name}
          </Link>
          <Link
            to={`/school/${props.school.id}`}
            color="orange.500"
            fontWeight={600}
            isTruncated
            lineHeight="short"
            mt={-2}
            title={startCase(props.school.name.toLowerCase())}
          >
            {startCase(props.school.name.toLowerCase())}
          </Link>
          <Flex justifyContent="space-between" alignItems="center">
            {props.event.isOnlineEvent ? (
              <Text
                fontSize="sm"
                color="gray.400"
                fontWeight={600}
                textTransform="uppercase"
                isTruncated
              >
                Online
              </Text>
            ) : null}
            {props.event.responses &&
            props.event.responses.yes &&
            props.event.responses.yes > 0 ? (
              <Text
                fontSize="sm"
                color="gray.400"
                fontWeight={600}
                textTransform="uppercase"
                flexShrink={0}
              >
                {props.event.responses.yes} Attending
              </Text>
            ) : null}
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
};

export default EventListItem;
