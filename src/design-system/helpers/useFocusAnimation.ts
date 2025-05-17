import { theme } from "@/design-system/theme/theme";

export const useFocusAnimation = (isFocused: boolean) => {
  return {
    transition: 'transform 0.4s ease-in-out',
    transform: [{ scale: isFocused ? theme.scale.focused : theme.scale.unfocused }],
  };
};
