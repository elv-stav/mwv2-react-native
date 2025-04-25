import { Animated, Button, View } from "react-native";
import { ButtonProps } from "react-native/Libraries/Components/Button";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { forwardRef } from "react";
import { useFocusAnimation } from "@/design-system/helpers/useFocusAnimation";
import styled from "@emotion/native";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { Typography } from "@/components/Typography";

const ButtonContent = forwardRef<View, { label: string; isFocused: boolean }>((props, ref) => {
  const { isFocused, label } = props;
  const anim = useFocusAnimation(isFocused);
  return (
    <Container style={anim} isFocused={isFocused} ref={ref}>
      <ColoredTypography isFocused={isFocused}>{label}</ColoredTypography>
    </Container>
  );
});

const TvButton = ({ title, onPress }: ButtonProps) => {
  return (
    <SpatialNavigationFocusableView onSelect={onPress}>
      {({ isFocused, isRootActive }) => (
        <ButtonContent label={title} isFocused={isFocused && isRootActive} />
      )}
    </SpatialNavigationFocusableView>
  );
};

export default TvButton;

const Container = styled(Animated.View)<{ isFocused: boolean }>(({ isFocused, theme }) => ({
  alignSelf: 'baseline',
  backgroundColor: isFocused ? 'white' : 'black',
  padding: theme.spacings.$4,
  borderRadius: scaledPixels(12),
  cursor: 'pointer',
}));

const ColoredTypography = styled(Typography)<{ isFocused: boolean }>(({ isFocused }) => ({
  color: isFocused ? 'black' : 'white',
}));
