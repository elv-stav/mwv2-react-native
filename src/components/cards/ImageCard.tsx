import { observer } from "mobx-react-lite";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { useFocusAnimation } from "@/design-system/helpers/useFocusAnimation";
import React from "react";
import styled from "@emotion/native/dist/emotion-native.cjs";
import { Animated, Image } from "react-native";
import { ImageURISource } from "react-native/Libraries/Image/ImageSource";

type ImageCardProps = {
  title: string;
  imageSource?: ImageURISource;
  href?: string;
  onSelect?: () => void;
  onFocus?: () => void;
  aspectRatio?: number;
}

/**
 * @param title {string} - title to show when highlighted
 * @param imageUrl {string} - url of the image to show. Must be a valid URL.
 * @param href {string} - Optional. url to navigate to when clicked. Should be mutually exclusive with onSelect.
 * @param onSelect {function} - Optional. callback to invoke when clicked. Should be mutually exclusive with href.
 */
const ImageCard = observer(({ title, imageSource, onSelect, onFocus, aspectRatio = 1.0 }: ImageCardProps) => {
  return (<SpatialNavigationFocusableView onSelect={onSelect} onFocus={onFocus}>
    {({ isFocused }) => (
      <Container isFocused={isFocused} aspectRatio={aspectRatio} style={useFocusAnimation(isFocused)}>
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
  aspectRatio?: number;
}>(({ isFocused, aspectRatio, theme }) => ({
  height: theme.sizes.carousel.card.height,
  aspectRatio: aspectRatio,
  overflow: 'hidden',
  borderRadius: 12,
  borderColor: isFocused ? theme.colors.primary.light : 'transparent',
  borderWidth: 2,
  cursor: 'pointer',
}));

export default ImageCard;