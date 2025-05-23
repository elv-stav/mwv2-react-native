import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { forwardRef, RefObject } from "react";
import { Animated, ColorValue, View } from "react-native";
import { useFocusAnimation } from "@/design-system/helpers/useFocusAnimation";
import { Ionicons } from "@expo/vector-icons";
import {
  SpatialNavigationNodeRef
} from "react-tv-space-navigation/src/spatial-navigation/types/SpatialNavigationNodeRef";
import styled from "@emotion/native/dist/emotion-native.cjs";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";

type Glyphs = keyof typeof Ionicons.glyphMap;

const ButtonContent = forwardRef<View, {
  icon: Glyphs,
  size?: number,
  isFocused: boolean,
}>(
  ({ isFocused, icon, size }, ref) => {
    const anim = useFocusAnimation(isFocused);
    return (
      <Container ref={ref} style={anim} isFocused={isFocused}>
        <Ionicons name={icon} size={size} color={ButtonBgColor(!isFocused)} />
      </Container>
    );
  }
);

type TvIconButtonProps = {
  icon: Glyphs,
  size?: number,
  onSelect?: () => void,
  buttonRef?: RefObject<SpatialNavigationNodeRef>,
};
const TvIconButton = ({ icon, size, onSelect, buttonRef }: TvIconButtonProps) => {
  return (
    <SpatialNavigationFocusableView onSelect={onSelect} ref={buttonRef}>
      {({ isFocused, isRootActive }) => (
        <ButtonContent icon={icon} size={size} isFocused={isFocused && isRootActive} />
      )}
    </SpatialNavigationFocusableView>
  );
};

const Container = styled(Animated.View)<{ isFocused: boolean }>(({ isFocused }) => ({
  alignSelf: 'baseline',
  backgroundColor: ButtonBgColor(isFocused),
  padding: scaledPixels(20),
  borderRadius: 999,
  cursor: 'pointer',
}));

function ButtonBgColor(isFocused: boolean): ColorValue {
  if (isFocused) {
    return "#D4D4D4";
  } else {
    return "#3E3F40";
  }
}

export default TvIconButton;
