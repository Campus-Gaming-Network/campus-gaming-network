import React from "react";
import { SafeAreaView, FlatList } from "react-native";
import { VStack, Text, Box, Badge, Avatar, HStack } from "native-base";
import useFetchEventUsers from "../hooks/useFetchEventUsers";
import { createGravatarRequestUrl } from "@campus-gaming-network/tools";

export default function EventAttendees({ route }) {
  const id = route.params.eventId;
  const creatorId = route.params.creatorId;
  const [users, isLoading, error] = useFetchEventUsers(id);

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

  if (!users) {
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
      <Box>
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <HStack
              justifyContent="space-between"
              key={item.user.id}
              alignItems="center"
              padding="2"
            >
              <HStack>
                <Avatar
                  alignSelf="center"
                  bg="orange.500"
                  mr={2}
                  size="sm"
                  source={{
                    uri: createGravatarRequestUrl(item.user.gravatar),
                  }}
                >
                  BS
                </Avatar>
                <VStack>
                  <Text>
                    {item.user.firstName} {item.user.lastName}
                  </Text>
                  <Text
                    letterSpacing="sm"
                    mb="1"
                    noOfLines={1}
                    fontWeight="thin"
                    fontSize="2xs"
                    maxWidth="xs"
                  >
                    {item.user?.school?.name}
                  </Text>
                </VStack>
              </HStack>

              {item.user.id === creatorId && (
                <Badge
                  mr="2"
                  textTransform="uppercase"
                  variant="subtle"
                  colorScheme="orange"
                >
                  Event Creator
                </Badge>
              )}
            </HStack>
          )}
        />
      </Box>
    </SafeAreaView>
  );
}
