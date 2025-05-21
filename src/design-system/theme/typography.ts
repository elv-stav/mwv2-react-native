import { Inter_100Thin } from "@expo-google-fonts/inter/100Thin";
import { Inter_200ExtraLight } from "@expo-google-fonts/inter/200ExtraLight";
import { Inter_300Light } from "@expo-google-fonts/inter/300Light";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { Inter_800ExtraBold } from "@expo-google-fonts/inter/800ExtraBold";
import { Inter_900Black } from "@expo-google-fonts/inter/900Black";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { Dict } from "@/utils/Dict";
import { TextStyle } from "react-native";

export const fontFamilies = {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  // Italic variants, not currently used.
  // Inter_100Thin_Italic,
  // Inter_200ExtraLight_Italic,
  // Inter_300Light_Italic,
  // Inter_400Regular_Italic,
  // Inter_500Medium_Italic,
  // Inter_600SemiBold_Italic,
  // Inter_700Bold_Italic,
  // Inter_800ExtraBold_Italic,
  // Inter_900Black_Italic
} as const;

// React Native is weird and "fontWeight" doesn't actually work.
// We have to use a "fontFamily" that includes the weight.
export type InterFontFamilies = keyof typeof fontFamilies;

export type TypographyStyle = Omit<TextStyle, "fontFamily" | "fontWeight"> & { fontFamily?: InterFontFamilies }

export const typography: Dict<TypographyStyle> = {
  title: {
    fontFamily: "Inter_600SemiBold",
  },
  button: {
    fontSize: scaledPixels(40),
    fontFamily: "Inter_600SemiBold",
  },
} as const;
