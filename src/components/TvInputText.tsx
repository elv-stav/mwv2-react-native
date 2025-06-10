import { TextInputProps } from "react-native/Libraries/Components/TextInput/TextInput";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import styled from "@emotion/native/dist/emotion-native.cjs";
import { TextInput, View, ViewStyle } from "react-native";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import RemoteControlManager from "@/remote-control/RemoteControlManager";
import { useRef } from "react";
import { TypographyStyle } from "@/design-system/theme/typography";
import { Ionicons } from "@expo/vector-icons";

type Glyphs = keyof typeof Ionicons.glyphMap;

type Props = Omit<TextInputProps, "style"> & {
  icon?: Glyphs,
  style?: ViewStyle,
  textStyle?: TypographyStyle;
}

const TvInputText = (({ onKeyPress, icon, style, textStyle, ...rest }: Props) => {
  const ref = useRef<TextInput>(null);
  const hintColor = "#787878";
  return (<SpatialNavigationFocusableView
    style={style}
    onBlur={() => ref.current?.blur()}
    onSelect={() => ref.current?.focus()}
  >
    {({ isFocused }) => {
      return <Wrapper isFocused={isFocused}>
        {!!icon && <Icon name={icon} size={scaledPixels(48)} color={hintColor} />}
        <Input
          ref={ref}
          style={textStyle}
          onKeyPress={(e) => {
            switch (e.nativeEvent.key) {
              case "ArrowUp":
              case "ArrowDown":
              case "ArrowLeft":
              case "ArrowRight":
              case "Escape":
              case "GoBack":
                RemoteControlManager.handleKeyDown(e);
                break;
              default:
                onKeyPress?.(e);
            }
          }}
          placeholderTextColor={hintColor}
          {...rest}
        />
        <Underline isFocused={isFocused} />
      </Wrapper>;
    }}
  </SpatialNavigationFocusableView>);
});

const Wrapper = styled(View)<{ isFocused: boolean }>(({ isFocused }) => ({
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  borderColor: "white",
  borderRadius: scaledPixels(10),
  borderWidth: isFocused ? scaledPixels(4) : 0,
  paddingHorizontal: scaledPixels(20),
}));

const Input = styled(TextInput)(() => ({
  width: "100%",
  color: "white",
  fontFamily: "Inter_400Regular",
  alignSelf: 'baseline',
  paddingVertical: scaledPixels(14),
  cursor: 'pointer',
  outlineStyle: "none",
}));

const Icon = styled(Ionicons)(() => ({
  paddingRight: scaledPixels(10),
}));

const Underline = styled(View)<{ isFocused: boolean }>(({ isFocused }) => ({
  position: "absolute",
  left: 0,
  bottom: 0,
  width: "100%",
  height: isFocused ? 0 : scaledPixels(2),
  backgroundColor: "white",
}));

export default TvInputText;
