import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { SupportedKeys } from "@/remote-control/SupportedKeys";
import { useKey } from "@/hookes/useKey";
import { useNavigation } from "expo-router";

export const GoBackConfiguration = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const event = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => {
      event.remove();
    };
  }, []);

  const goBackOnBackPress = useCallback(
    (pressedKey: SupportedKeys) => {
      if (!navigation.isFocused) {
        return false;
      }
      if (pressedKey !== SupportedKeys.Back) return false;
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    },
    [navigation],
  );

  useKey(SupportedKeys.Back, goBackOnBackPress);

  return <></>;
};
