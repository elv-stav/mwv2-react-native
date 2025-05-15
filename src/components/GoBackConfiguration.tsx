import { useCallback } from 'react';
import { SupportedKeys } from "@/remote-control/SupportedKeys";
import { useKey } from "@/hookes/useKey";
import { useNavigation, useRouter } from "expo-router";

export const GoBackConfiguration = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const goBackOnBackPress = useCallback(
    (pressedKey: SupportedKeys) => {
      if (!navigation.isFocused()) {
        return false;
      }
      if (pressedKey !== SupportedKeys.Back) return false;
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      } else {
        // During development, the router can get in a state where the backstack is empty, but we aren't on "/".
        // To avoid this case, we just navigate to "/" directly. This is a no-op if we are already on "/".
        router.dismissTo("/");
      }
      return false;
    },
    [navigation, router],
  );

  useKey(SupportedKeys.Back, goBackOnBackPress);

  return <></>;
};
