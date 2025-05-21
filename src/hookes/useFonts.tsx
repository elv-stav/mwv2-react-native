import { useFonts as useFontsLoader } from 'expo-font';
import { fontFamilies } from "@/design-system/theme/typography";


export const useFonts = (): { areFontsLoaded: boolean } => {
  const [fontsLoaded, fontError] = useFontsLoader(fontFamilies);

  if (!fontsLoaded && !fontError) {
    return { areFontsLoaded: false };
  }

  return { areFontsLoaded: true };
};
