import "@/utils/polyfills/array.prototype.findLast.ts";

import { observer } from "mobx-react-lite";
import { Directions, SpatialNavigation, SpatialNavigationDeviceTypeProvider } from "react-tv-space-navigation";
import { SupportedKeys } from "@/remote-control/SupportedKeys";
import RemoteControlManager from "@/remote-control/RemoteControlManager";
import { StyleSheet, View } from "react-native";
import { useFonts } from "@/hookes/useFonts";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/design-system/theme/theme";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import React, { useEffect, useState } from "react";
import { NavigationRoute, ParamListBase } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Console, Hook, Unhook } from "console-feed";
import { Message } from "console-feed/lib/definitions/Component";
import { Ionicons } from "@expo/vector-icons";

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

  // expo-vector-icons has a weird issue on Tizen where it displays a chinese character on first load.
  // Even preloading the font ahead of time doesn't solve this, until the font is actually rendered once.
  // So we render a hidden icon to force the font to load.
  const iconFontLoader =<Ionicons name={"play"} size={0}/>

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{docTitle}</title>
      </Head>
      <SpatialNavigationDeviceTypeProvider>
        <View style={{ width: "100%", height: "100%", flexDirection: "row" }}>
          {iconFontLoader}
          <InAppConsole />
          <Stack screenOptions={{
            headerShown: false,
            contentStyle: styles.container,
          }} screenListeners={{
            state: (e) => {
              setDocTitle(buildPath(e.data.state.routes.slice(-1)[0]));
            }
          }} />
          {/* Temporarily enable toast msgs on all builds */}
          <Toast />
          {/*{(process.env.NODE_ENV == "development") && <Toast />}*/}
        </View>
      </SpatialNavigationDeviceTypeProvider>
    </ThemeProvider>
  );
});

/**
 * Take up a portion of the screen to show console logs. Useful for debugging on TVs where console is hard to access.
 */
const InAppConsole = observer(({}) => {
  // @ts-ignore
  if (1 === 1) { // Make condition fail to show console
    return <></>;
  }

  const [logs, setLogs] = useState<Message[]>([]);

  // run once!
  useEffect(() => {
    const hookedConsole = Hook(
      window.console,
      (log) => {
        // @ts-ignore - this lib is kinda dumb, and they have 2 "Message" types.
        // I'm not sure how to transition between them, but sending one as the other seems to work.
        setLogs((currLogs) => [log, ...currLogs,]);
      },
      false,
    );
    return () => {
      Unhook(hookedConsole);
    };
  }, []);

  return (
    <View style={{ width: "25%", height: "100%", backgroundColor: "#1e1e1e" }}>
      <Console logs={logs} variant={"dark"} />
    </View>
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
