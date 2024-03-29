// Libraries
import React from "react";
import { Image, Flex, Text } from "src/components/common";

////////////////////////////////////////////////////////////////////////////////
// GameCover

const GameCover = React.memo(({ url, name, ...rest }) => {
  if (!name) {
    return null;
  }

  if (!url) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        bg="gray.100"
        w="90px"
        h="90px"
        rounded="md"
        shadow="md"
      >
        <Text fontSize="xs" fontWeight={600} color="gray.500">
          No game cover
        </Text>
      </Flex>
    );
  }

  return (
    <Image
      src={`https:${url}`}
      alt={`The cover art for the game ${name}`}
      title={`The cover art for the game ${name}`}
      rounded="md"
      shadow="md"
      loading="lazy"
      {...rest}
    />
  );
});

export default GameCover;
