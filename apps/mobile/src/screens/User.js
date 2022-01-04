import React from 'react';
import { Button, Text } from 'react-native';
import { Center } from 'native-base';

export default function User({ navigation }) {
  return (
    <Center flex={1}>
      <Text>User</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="Go back to first screen in stack" onPress={() => navigation.popToTop()} />
    </Center>
  );
}
