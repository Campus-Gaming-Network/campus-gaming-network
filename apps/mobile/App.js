import React from "react";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import Constants from "expo-constants";
import * as Sentry from "sentry-expo";
import "text-encoding-polyfill";

// Components
import Screens from "./src/components/Screens";

// Providers
import { AuthProvider } from "./src/providers/auth";

const sentryConfig = {
  dsn: Constants.manifest.extra.sentryDsn,
  environment:
    process.env.NODE_ENV === "development" ? "development" : "production",
  enableInExpoDevelopment: true,
  debug: process.env.NODE_ENV === "development",
};

Sentry.init(sentryConfig);

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <AuthProvider>
          <Screens />
        </AuthProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
