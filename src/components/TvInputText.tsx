import { TextInputProps } from "react-native/Libraries/Components/TextInput/TextInput";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import styled from "@emotion/native/dist/emotion-native.cjs";
import { TextInput } from "react-native";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import RemoteControlManager from "@/remote-control/RemoteControlManager";
import { useRef } from "react";
import { InterFontFamilies, TypographyStyle } from "@/design-system/theme/typography";

type Props = Omit<TextInputProps, "style"> & {
  style?: TypographyStyle;
}

const TvInputText = (({ onKeyPress, ...rest }: Props) => {
  const ref = useRef<TextInput>(null);
  return (<SpatialNavigationFocusableView
    onBlur={() => ref.current?.blur()}
    onSelect={() => ref.current?.focus()}
  >
    {({ isFocused }) => {
      return <Input
        ref={ref}
        isFocused={isFocused}
        onKeyPress={(e) => {
          switch (e.nativeEvent.key) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowLeft":
            case "ArrowRight":
              RemoteControlManager.handleKeyDown(e);
              break;
            default:
              onKeyPress?.(e);
          }
        }}
        placeholderTextColor={"#888888"}
        {...rest}
      />;
    }}
  </SpatialNavigationFocusableView>);
});

const Input = styled(TextInput)<{ isFocused: boolean }>(({ isFocused }) => ({
  color: "white",
  fontFamily: "Inter_400Regular",
  alignSelf: 'baseline',
  borderColor: "white",
  paddingVertical: scaledPixels(14),
  paddingHorizontal: scaledPixels(40),
  borderRadius: scaledPixels(10),
  borderWidth: isFocused ? scaledPixels(4) : 0,
  cursor: 'pointer',
}));

export default TvInputText;
