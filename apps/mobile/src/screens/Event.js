import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import {
  Heading,
  Divider,
  VStack,
  Image,
  Text,
  Box,
  Flex,
  Badge,
  Button,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import background from "../../assets/background.png";
import useFetchEventDetails from "../hooks/useFetchEventDetails";
import { DateTime } from "luxon";

export default function Event({ route, navigation }) {
  const id = route.params.eventId;
  const [event, isLoading, error] = useFetchEventDetails(id);

  if (isLoading) {
    return (
      <SafeAreaView>
        <Box>
          <Text>Loading...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView>
        <Box>
          <Text>Error</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView>
        <Box>
          <Text>No data</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Box>
          <Image source={background} w="100%" h={125} />
          <VStack p={4}>
            {event.hasStarted ? (
              <Flex bg="green.100" mr="auto" px={4} rounded="lg">
                <Text
                  color="green.600"
                  textTransform="uppercase"
                  bold
                  fontSize="sm"
                  isTruncated
                >
                  Happening now
                </Text>
              </Flex>
            ) : event.hasEnded ? (
              <Flex bg="red.100" mr="auto" px={2} rounded="lg">
                <Text
                  color="red.600"
                  textTransform="uppercase"
                  bold
                  fontSize="sm"
                  isTruncated
                >
                  Event ended
                </Text>
              </Flex>
            ) : null}
            <Heading fontSize="3xl" bold lineHeight="sm">
              {event.name}
            </Heading>
            <Heading fontSize="md" bold pt={1}>
              {event.school.name}
            </Heading>
            {event.isOnlineEvent ? (
              <Badge mt={2} fontSize="xs" color="gray.500" mr="auto">
                Online Event
              </Badge>
            ) : null}
            <Divider my={4} />
            <VStack space={8}>
              <VStack>
                <Flex direction="row">
                  <Box pr={2} pt={1}>
                    <FontAwesome name="calendar" size={16} />
                  </Box>
                  <VStack>
                    <Text bold fontSize="md" lineHeight="sm">
                      {DateTime.fromSeconds(
                        event.startDateTime.seconds
                      ).toLocaleString({
                        ...DateTime.DATETIME_FULL,
                        ...{ month: "long", day: "numeric" },
                      })}
                    </Text>
                    <Text bold fontSize="md">
                      {DateTime.fromSeconds(
                        event.endDateTime.seconds
                      ).toLocaleString({
                        ...DateTime.DATETIME_FULL,
                        ...{ month: "long", day: "numeric" },
                      })}
                    </Text>
                  </VStack>
                </Flex>
                {event.location ? (
                  <Flex pt={4} direction="row">
                    <Box pr={2}>
                      <FontAwesome name="map-marker" size={18} />
                    </Box>
                    <VStack>
                      <Text bold fontSize="md" lineHeight="sm">
                        {event.location}
                      </Text>
                    </VStack>
                  </Flex>
                ) : null}
              </VStack>
              <Box>
                <Heading pb={2}>Description</Heading>
                <Text>{event.description}</Text>
              </Box>
              {Boolean(event.responses.yes) ? (
                <Box>
                  <Button
                    onPress={() =>
                      navigation.navigate("EventAttendees", {
                        creatorId: event.creator,
                        eventId: id,
                      })
                    }
                    mt="1"
                    colorScheme="orange"
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      View Attendees ({event.responses.yes})
                    </Text>
                  </Button>
                </Box>
              ) : (
                <Text>No one going :(</Text>
              )}
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
