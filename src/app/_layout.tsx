import { observer } from "mobx-react-lite";
import { Directions, SpatialNavigation, SpatialNavigationDeviceTypeProvider } from "react-tv-space-navigation";
import { SupportedKeys } from "@/remote-control/SupportedKeys";
import RemoteControlManager from "@/remote-control/RemoteControlManager";
import { StyleSheet } from "react-native";
import { useFonts } from "@/hookes/useFonts";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/design-system/theme/theme";
import { router, Stack } from "expo-router";
import Head from "expo-router/head";
import React, { useState } from "react";
import { useNavigatorContext } from "expo-router/build/views/Navigator";
import { NavigationRoute, ParamListBase, useRoute } from "@react-navigation/native";

SpatialNavigation.configureRemoteControl({
  remoteControlSubscriber: (callback) => {
    const mapping: { [key in SupportedKeys]: Directions | null } = {
      [SupportedKeys.Right]: Directions.RIGHT,
      [SupportedKeys.Left]: Directions.LEFT,
      [SupportedKeys.Up]: Directions.UP,
      [SupportedKeys.Down]: Directions.DOWN,
      [SupportedKeys.Enter]: Directions.ENTER,
      [SupportedKeys.LongEnter]: Directions.LONG_ENTER,
      [SupportedKeys.Back]: null,
    };

    const remoteControlListener = (event: SupportedKeys) => {
      callback(mapping[event]);
      return false;
    };

    return RemoteControlManager.addKeydownListener(remoteControlListener);
  },

  remoteControlUnsubscriber: (remoteControlListener) => {
    RemoteControlManager.removeKeydownListener(remoteControlListener);
  },
});

const App = observer(({}) => {
  const areFontsLoaded = useFonts();
  // For debugging purposes, we can use the route name as the document title.
  const [docTitle, setDocTitle] = useState("");

  if (!areFontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{docTitle}</title>
      </Head>
      <SpatialNavigationDeviceTypeProvider>
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: styles.container,
        }} screenListeners={{
          state: (e) => {
            setDocTitle(buildPath(e.data.state.routes.slice(-1)[0]));
            // setDocTitle()
            // console.log("Current route state:", (e.data.state.routes.slice(-1)[0]));
          }
        }} />
      </SpatialNavigationDeviceTypeProvider>
    </ThemeProvider>
  );
});

// Only for debugging purposes, to build a path from the route name and params.
function buildPath(route: NavigationRoute<ParamListBase, string>) {
  let result = route.name;
  Object.keys(route.params ?? {}).forEach((key) => {
    result = result.replace(`[${key}]`, (route.params as Record<string, unknown>)?.[key]?.toString() ?? '');
  });
  return result;
}

export default App;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: theme.colors.background.mainHover,
  },
});
