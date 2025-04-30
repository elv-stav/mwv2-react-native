import { observer } from "mobx-react-lite";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { useFocusAnimation } from "@/design-system/helpers/useFocusAnimation";
import React from "react";
import styled from "@emotion/native/dist/emotion-native.cjs";
import { Animated, Image } from "react-native";
import { ImageURISource } from "react-native/Libraries/Image/ImageSource";

type ImageCardProps = {
  id: string;
  title: string;
  imageUrl?: string;
  href?: string;
  onSelect?: () => void;
  onFocus?: () => void;
}

/**
 * @param id {string} - unique id of the card, required for proper D-PAD navigation.
 * @param title {string} - title to show when highlighted
 * @param imageUrl {string} - url of the image to show. Must be a valid URL.
 * @param href {string} - Optional. url to navigate to when clicked. Should be mutually exclusive with onSelect.
 * @param onSelect {function} - Optional. callback to invoke when clicked. Should be mutually exclusive with href.
 */
const ImageCard = observer(({ id, title, imageUrl, onSelect, onFocus }: ImageCardProps) => {
  const imageSource: (ImageURISource | undefined) = imageUrl ? { uri: imageUrl } : undefined;
  return (<SpatialNavigationFocusableView onSelect={onSelect} onFocus={onFocus}>
    {({ isFocused }) => (
      <Container isFocused={isFocused} style={useFocusAnimation(isFocused)}>
        <Image source={imageSource} style={{
          height: '100%',
          width: '100%',
        }} />
      </Container>
    )}
  </SpatialNavigationFocusableView>);
});

const Container = styled(Animated.View)<{
  isFocused: boolean;
}>(({ isFocused, theme }) => ({
  height: theme.sizes.carousel.card.height,
  width: theme.sizes.propertyCard.width,
  overflow: 'hidden',
  borderRadius: 12,
  borderColor: isFocused ? theme.colors.primary.light : 'transparent',
  borderWidth: 2,
  cursor: 'pointer',
}));

export default ImageCard;