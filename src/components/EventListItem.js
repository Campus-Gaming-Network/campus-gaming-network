import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
  Stack,
  Box,
  Text,
  Image,
  Badge,
} from "@chakra-ui/core";
import moment from "moment";
import truncate from "lodash.truncate";
import * as constants from "./constants";
import Link from "./Link";
import TEST_DATA from "./test_data";

const EventListItem = props => {
    if (!props.event) {
      // TODO: Handle gracefully
      console.log("no event");
      return null;
    }
  
    const school = TEST_DATA.schools[props.event.schoolId];
  
    if (!school) {
      // TODO: Handle gracefully
      console.log("no school");
      return null;
    }
  
    const eventResponses = getEventResponses(props.event.index);
  
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
                to={`../../school/${school.id}`}
                className={`${constants.STYLES.LINK.DEFAULT} text-xl leading-none`}
              >
                {school.name}
              </Link>
              <Link
                to={`../../event/${props.event.id}`}
                className={`${constants.STYLES.LINK.DEFAULT} block font-semibold text-3xl mt-1 leading-none`}
              >
                {props.event.title}
              </Link>
            </Box>
            <Image
              src={school.logo}
              alt={`${school.name} Logo`}
              className="w-auto ml-auto h-16"
            />
          </Box>
          <Box display="block">
            <FontAwesomeIcon icon={faClock} className="text-gray-700 mr-2" />
            <time className="text-lg" dateTime={props.event.startDateTime}>
              {moment(props.event.startDateTime).calendar(
                null,
                constants.MOMENT_CALENDAR_FORMAT
              )}
            </time>
          </Box>
          <Text fontSize="lg">
            {truncate(props.event.description, { length: 250 })}
          </Text>
          {eventResponses.length ? (
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
                <Text>{eventResponses.length} Going</Text>
              </Box>
            </Badge>
          ) : null}
        </Stack>
      </Box>
    );
  };

  export default EventListItem;
