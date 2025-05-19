import { Animated, View } from "react-native";
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

type TvButtonProps = Omit<ButtonProps, 'onPress'> & { onSelect?: () => void }

const TvButton = ({ title, onSelect }: TvButtonProps) => {
    return (
      <SpatialNavigationFocusableView onSelect={onSelect}>
        {({ isFocused, isRootActive }) => (
          <ButtonContent label={title} isFocused={isFocused && isRootActive} />
        )}
      </SpatialNavigationFocusableView>
    );
  }
;

export default TvButton;

const Container = styled(Animated.View)<{ isFocused: boolean }>(({ isFocused, theme }) => ({
  alignSelf: 'baseline',
  backgroundColor: isFocused ? '#D4D4D4' : '#3E3F40',
  paddingVertical: scaledPixels(14),
  paddingHorizontal: scaledPixels(40),
  borderRadius: scaledPixels(10),
  cursor: 'pointer',
}));

const ColoredTypography = styled(Typography)<{ isFocused: boolean }>(({ isFocused, theme }) => ({
  color: isFocused ? 'black' : 'white',
  fontSize: theme.typography.button.fontSize,
}));
