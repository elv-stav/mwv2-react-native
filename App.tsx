import "@expo/metro-runtime";
import { useWindowDimensions } from 'react-native';
import { Directions, SpatialNavigation, SpatialNavigationDeviceTypeProvider } from "react-tv-space-navigation";
import { useFonts } from "@/hookes/useFonts";
import RemoteControlManager from "@/remote-control/RemoteControlManager";
import { SupportedKeys } from "@/remote-control/SupportedKeys";
import { theme } from "@/design-system/theme/theme";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "@emotion/react";
import styled from "@emotion/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Discover } from "@/pages/Discover";
import { RootStackParamList } from "@/routing/RootStackParamList";

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

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const { height, width } = useWindowDimensions();
  const areFontsLoaded = useFonts();

  if (!areFontsLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <SpatialNavigationDeviceTypeProvider>
          <Container width={width} height={height}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: theme.colors.background.main,
                },
              }}
              initialRouteName="Discover"
            >
              <Stack.Screen name="Discover" component={Discover} />
              {/*<Stack.Screen name="PropertyDetail" component={PropertyDetail} />*/}
            </Stack.Navigator>
          </Container>
        </SpatialNavigationDeviceTypeProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}

const Container = styled.View<{ width: number; height: number }>(({ width, height }) => ({
  width,
  height,
  flexDirection: 'row-reverse',
  backgroundColor: theme.colors.background.main,
}));
