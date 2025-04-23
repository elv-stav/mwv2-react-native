import "@expo/metro-runtime";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Directions, SpatialNavigation, SpatialNavigationRoot } from "react-tv-space-navigation";
import { useFonts } from "@/hookes/useFonts";
import RemoteControlManager from "@/remote-control/RemoteControlManager";
import { SupportedKeys } from "@/remote-control/SupportedKeys";

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

export default function App() {
  const areFontsLoaded = useFonts();

  if (!areFontsLoaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <SpatialNavigationRoot>
        <Text>Open up App.tsx to start working on your app!</Text>
      </SpatialNavigationRoot>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
