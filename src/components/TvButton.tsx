import { Animated, ColorValue, View } from "react-native";
import { ButtonProps } from "react-native/Libraries/Components/Button";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { forwardRef, RefObject } from "react";
import { useFocusAnimation } from "@/design-system/helpers/useFocusAnimation";
import styled from "@emotion/native";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { Typography } from "@/components/Typography";
import {
  SpatialNavigationNodeRef
} from "react-tv-space-navigation/src/spatial-navigation/types/SpatialNavigationNodeRef";

const ButtonContent = forwardRef<View, { label: string; isFocused: boolean, style?: TvButtonStyle }>(
  ({ isFocused, label, style = {} }, ref) => {
    const anim = useFocusAnimation(isFocused);
    return (
      <Container ref={ref} style={anim} isFocused={isFocused} buttonStyle={style}>
        <ColoredTypography isFocused={isFocused} fontSize={style.fontSize}>{label}</ColoredTypography>
      </Container>
    );
  }
);

type TvButtonStyle = {
  variant?: 'fill' | 'outline';
  fontSize?: number;
}

type TvButtonProps = Omit<ButtonProps, 'onPress'> & {
  style?: TvButtonStyle,
  onSelect?: () => void,
  buttonRef?: RefObject<SpatialNavigationNodeRef>
};

const TvButton = ({ title, style, onSelect, buttonRef }: TvButtonProps) => {
    return (
      <SpatialNavigationFocusableView onSelect={onSelect} ref={buttonRef}>
        {({ isFocused, isRootActive }) => (
          <ButtonContent label={title} style={style} isFocused={isFocused && isRootActive} />
        )}
      </SpatialNavigationFocusableView>
    );
  }
;

export default TvButton;

const Container = styled(Animated.View)<{ isFocused: boolean, buttonStyle: TvButtonStyle }>(({
                                                                                               isFocused,
                                                                                               buttonStyle,
                                                                                               theme
                                                                                             }) => ({
  alignSelf: 'baseline',
  backgroundColor: ButtonBgColor(isFocused, buttonStyle),
  paddingVertical: scaledPixels(14),
  paddingHorizontal: scaledPixels(40),
  borderRadius: scaledPixels(10),
  borderWidth: scaledPixels(4),
  borderColor: ButtonBorderColor(isFocused, buttonStyle),
  cursor: 'pointer',
}));

const ColoredTypography = styled(Typography)<{ isFocused: boolean, fontSize?: number }>(({
                                                                                           isFocused,
                                                                                           fontSize,
                                                                                           theme
                                                                                         }) => ({
  color: isFocused ? 'black' : 'white',
  fontSize: fontSize || theme.typography.button.fontSize,
}));

function ButtonBgColor(isFocused: boolean, style: TvButtonStyle): ColorValue {
  if (isFocused) {
    return "#D4D4D4";
  }

  switch (style.variant) {
    case "outline":
      return "transparent";
    case "fill":
    default:
      return "#3E3F40";
  }
}

function ButtonBorderColor(isFocused: boolean, style: TvButtonStyle): ColorValue {
  if (style.variant === "outline") {
    return "#D4D4D4";
  }
  return ButtonBgColor(isFocused, style);
}