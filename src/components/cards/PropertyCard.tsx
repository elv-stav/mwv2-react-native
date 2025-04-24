import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import styled from "@emotion/native";
import { Animated, Text, Image } from "react-native";
import { useFocusAnimation } from "@/design-system/helpers/useFocusAnimation";
import React from "react";
import { observer } from "mobx-react-lite";

type Props = {
  property: MediaPropertyModel,
  onSelect?: () => void,
  onFocus?: () => void,
}

export const PropertyCard = observer(({ property, onSelect, onFocus }: Props) => {
  const imageSource = property.image!.urlSource();
  return (<SpatialNavigationFocusableView onSelect={onSelect} onFocus={onFocus}>
    {({ isFocused }) => (
      <Container isFocused={isFocused} style={useFocusAnimation(isFocused)}>
        <PropertyImage source={imageSource} />
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

const PropertyImage = React.memo(
  styled(Image)({
    height: '100%',
    width: '100%',
  }),
);
