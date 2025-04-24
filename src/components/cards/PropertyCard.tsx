import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import styled from "@emotion/native";
import { Animated, Text } from "react-native";
import { theme } from "@/design-system/theme/theme";
import { useFocusAnimation } from "@/design-system/helpers/useFocusAnimation";

type Props = {
  property: MediaPropertyModel,
  onSelect?: () => void,
  onFocus?: () => void,
}

export const PropertyCard = /*observer*/(({ property, onSelect, onFocus }: Props) => {
  return (<SpatialNavigationFocusableView onSelect={onSelect} onFocus={onFocus}>
    {({ isFocused }) => (
      <Container isFocused={isFocused} style={useFocusAnimation(isFocused)}>
        <Text>HI!</Text>
      </Container>
    )}
  </SpatialNavigationFocusableView>);
});

const Container = styled(Animated.View)<{
  isFocused: boolean;
}>(({ isFocused, theme }) => ({
  height: theme.sizes.propertyCard.height,
  width: theme.sizes.propertyCard.width,
  overflow: 'hidden',
  borderRadius: 0,
  borderColor: isFocused ? theme.colors.primary.light : 'transparent',
  borderWidth: 2,
  cursor: 'pointer',
}));
