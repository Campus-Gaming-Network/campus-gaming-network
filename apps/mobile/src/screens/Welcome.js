import React from "react";
import { Text, Box, Heading, Button, Image, VStack } from "native-base";
import logo from "../../assets/logo.png";
import { getStorageItem } from "../utilities/storage";
import { STORAGE_KEYS } from "../constants/storage";

export default function Welcome({ navigation }) {
  const [user, setUser] = React.useState(null);

  const getUser = async () => {
    const savedUser = await getStorageItem(STORAGE_KEYS.AUTH);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <Box safeArea flex={1} p="2" py="8" w="90%" mx="auto">
      <VStack alignItems="center" mt={100} space={6}>
        <Image
          source={logo}
          style={{ height: 100, width: 100 }}
          alt="Campus Gaming Network logo"
        />
        <Heading size="lg" fontWeight="bold">
          Campus Gaming Network
        </Heading>
        <Text>({user ? user.email : null})</Text>
      </VStack>
      <Button
        mt={6}
        colorScheme="orange"
        onPress={() => navigation.navigate("LogIn")}
        _text={{ fontWeight: "bold" }}
      >
        Log In
      </Button>
    </Box>
  );
}
