import { useFonts as useFontsLoader } from 'expo-font';

export const useFonts = (): { areFontsLoaded: boolean } => {
  const [fontsLoaded, fontError] = useFontsLoader({
    'inter-bold': require("@/assets/fonts/inter_bold.ttf"),
    'inter-medium': require("@/assets/fonts/inter_medium.ttf"),
    'inter-regular': require("@/assets/fonts/inter_regular.ttf"),
    'inter-semibold': require("@/assets/fonts/inter_semibold.ttf"),
    'inter-thin': require("@/assets/fonts/inter_thin.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return { areFontsLoaded: false };
  }

  return { areFontsLoaded: true };
};
