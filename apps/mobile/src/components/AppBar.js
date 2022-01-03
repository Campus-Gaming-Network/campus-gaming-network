import React from "react";
import { HStack, IconButton, Icon, Text, Box, StatusBar } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

const AppBar = (props) => {
  return (
    <React.Fragment>
      <StatusBar />

      <Box safeAreaTop />

      <HStack
        bg="#f15a29"
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack space="4" alignItems="center">
          <IconButton
            icon={
              <Icon
                size="sm"
                as={<MaterialIcons name="menu" />}
                color="white"
              />
            }
          />
          <Text color="white" fontSize="20" fontWeight="bold">
            {props.title}
          </Text>
        </HStack>

        <HStack space="2">
          <IconButton
            icon={
              <Icon
                as={<MaterialIcons name="favorite" />}
                size="sm"
                color="white"
              />
            }
          />
          <IconButton
            icon={
              <Icon
                as={<MaterialIcons name="search" />}
                color="white"
                size="sm"
              />
            }
          />
          <IconButton
            icon={
              <Icon
                as={<MaterialIcons name="more-vert" />}
                size="sm"
                color="white"
              />
            }
          />
        </HStack>
      </HStack>
    </React.Fragment>
  );
};

export default AppBar;
