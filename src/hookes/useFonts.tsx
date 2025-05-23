import { useFonts as useFontsLoader } from 'expo-font';
import { fontFamilies } from "@/design-system/theme/typography";
import { Ionicons } from "@expo/vector-icons";


export const useFonts = (): { areFontsLoaded: boolean } => {
  const [fontsLoaded, fontError] = useFontsLoader({ ...fontFamilies, ...Ionicons.font });

  if (!fontsLoaded && !fontError) {
    return { areFontsLoaded: false };
  }

  return { areFontsLoaded: true };
};
