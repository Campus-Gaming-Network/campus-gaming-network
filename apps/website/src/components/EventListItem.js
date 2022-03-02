// Libraries
import React from "react";
import { Text, Flex, Stack, Badge } from "src/components/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSchool } from "@fortawesome/free-solid-svg-icons";

// Components
import SchoolLogo from "src/components/SchoolLogo";
import Link from "src/components/Link";
import SliderCard from "src/components/SliderCard";
import Time from "src/components/Time";

////////////////////////////////////////////////////////////////////////////////
// EventListItem

const EventListItem = (props) => {
  console.log(props);
  // if (!props.event) {
  if (!props.event || !props.school) {
    return null;
  }

  return (
    <SliderCard h="200px">
      <Flex direction="column" justify="space-between" height="100%">
        <Stack>
          <Flex justify="space-between" align="Center">
            {props.event.hasEnded ? (
              <Text
                d="inline"
                color="red.400"
                fontSize="sm"
                textTransform="uppercase"
                fontWeight="bold"
                isTruncated
                title="Event ended"
              >
                Event ended
              </Text>
            ) : props.event.hasStarted ? (
              <Text
                d="inline"
                color="green.400"
                fontSize="sm"
                textTransform="uppercase"
                fontWeight="bold"
                isTruncated
                title="Happening now"
              >
                Happening now
              </Text>
            ) : (
              <Time
                d="inline"
                color="blue.500"
                fontWeight="bold"
                dateTime={props.event.startDateTime}
                fontSize="sm"
                isTruncated
              />
            )}
            {/* <SchoolLogo
              schoolId={props.school.id}
              schoolName={props.school.formattedName}
              h={6}
              w={6}
              htmlHeight={6}
              htmlWidth={6}
              ml={2}
              fallback={
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  color="gray.500"
                  h={6}
                  w={6}
                  ml={2}
                >
                  <FontAwesomeIcon icon={faSchool} />
                </Flex>
              }
            /> */}
          </Flex>
          <Link
            href={`/event/${props.event.id}`}
            color="gray.700"
            fontWeight={900}
            fontSize="2xl"
            title={props.event.name}
            noOfLines={3}
            lineHeight="1.2"
          >
            {props.event.name}
          </Link>
          {/* <Link
            href={`/school/${props.school.handle}`}
            color="gray.500"
            fontWeight={600}
            fontSize="sm"
            isTruncated
            title={props.school.formattedName}
          >
            {props.school.formattedName}
          </Link> */}
        </Stack>
        <Flex justifyContent="space-between" alignItems="center">
          {props.event.isOnlineEvent ? (
            <Badge fontSize="xs" color="gray.500" isTruncated>
              Online event
            </Badge>
          ) : null}
          {/* {Boolean(props.event.responses?.yes?.length) > 0 ? (
            <Text
              fontSize="xs"
              color="gray.500"
              fontWeight={600}
              flexShrink={0}
            >
              {props.event.responses.yes} Attending
            </Text>
          ) : null} */}
        </Flex>
      </Flex>
    </SliderCard>
  );
};

export default EventListItem;
