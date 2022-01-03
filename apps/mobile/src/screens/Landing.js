import React from "react";
import { SafeAreaView, FlatList } from "react-native";
import {
  Divider,
  VStack,
  Text,
  Box,
  Pressable,
  Flex,
  Badge,
} from "native-base";
import useFetchUserEvents from "../hooks/useFetchUserEvents";
import { auth } from "../firebase";

export default function Landing({ navigation }) {
  const id = auth.currentUser.uid;
  const [events, isLoading, error] = useFetchUserEvents(id);

  const handleOnPress = (eventId) => {
    navigation.navigate("Event", { eventId });
  };

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

  if (!events) {
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
      <Box bg="white" pt={4}>
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleOnPress(item.id)} bg="white" px={6}>
              <VStack>
                {item.hasStarted ? (
                  <Text
                    color="green.600"
                    textTransform="uppercase"
                    bold
                    fontSize="sm"
                    isTruncated
                  >
                    Happening now
                  </Text>
                ) : (
                  <Text color="blue.600" fontSize="sm" bold isTruncated>
                    {item.date}
                  </Text>
                )}
                <Text
                  color="gray.700"
                  fontSize="md"
                  bold
                  lineHeight="md"
                  numberOfLines={3}
                >
                  {item.title}
                </Text>
                <Text color="gray.500" bold fontSize="sm" isTruncated>
                  {item.school}
                </Text>
                <Flex mt={3} justify="space-between" direction="row">
                  {item.isOnlineEvent ? (
                    <Badge fontSize="xs" color="gray.500">
                      Online Event
                    </Badge>
                  ) : null}
                  {item.going > 0 ? (
                    <Text fontSize="xs" color="gray.500" bold flexShrink={0}>
                      {item.going} attending
                    </Text>
                  ) : null}
                </Flex>
                <Divider my={2} />
              </VStack>
            </Pressable>
          )}
        />
      </Box>
    </SafeAreaView>
  );
}
