import { observer } from "mobx-react-lite";
import { Directions, SpatialNavigation, SpatialNavigationDeviceTypeProvider } from "react-tv-space-navigation";
import { SupportedKeys } from "@/remote-control/SupportedKeys";
import RemoteControlManager from "@/remote-control/RemoteControlManager";
import { StyleSheet } from "react-native";
import { useFonts } from "@/hookes/useFonts";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/design-system/theme/theme";
import { Stack } from "expo-router";

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

  if (!areFontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <SpatialNavigationDeviceTypeProvider>
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: styles.container,
        }} />
      </SpatialNavigationDeviceTypeProvider>
    </ThemeProvider>
  );
});

export default App;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: theme.colors.background.mainHover,
  },
});
