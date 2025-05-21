import { observer } from "mobx-react-lite";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { useFocusAnimation } from "@/design-system/helpers/useFocusAnimation";
import React, { ReactElement } from "react";
import styled from "@emotion/native/dist/emotion-native.cjs";
import { Animated, Image } from "react-native";
import { ImageURISource } from "react-native/Libraries/Image/ImageSource";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { Ionicons } from "@expo/vector-icons";
import Center from "@/components/Center";
import { DimensionValue } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type ImageCardProps = {
  imageSource?: ImageURISource;
  height?: DimensionValue,
  href?: string;
  onSelect?: () => void;
  onFocus?: () => void;
  aspectRatio?: number;
  playable?: boolean;
  inaccessible?: boolean;
  focusedOverlay?: ReactElement;
  unfocusedOverlay?: ReactElement;
}

/**
 * @param imageUrl {string} - url of the image to show. Must be a valid URL.
 * @param href {string} - Optional. url to navigate to when clicked. Should be mutually exclusive with onSelect.
 * @param onSelect {function} - Optional. callback to invoke when clicked. Should be mutually exclusive with href.
 */
const ImageCard = observer(({
                              imageSource,
                              height,
                              onSelect,
                              onFocus,
                              focusedOverlay,
                              unfocusedOverlay,
                              aspectRatio = 1.0,
                              playable = false,
                              inaccessible = false,
                            }: ImageCardProps) => {
  return (<SpatialNavigationFocusableView onSelect={onSelect} onFocus={onFocus}>
    {({ isFocused }) => (
      <Container
        height={height}
        isFocused={isFocused}
        inaccessible={inaccessible}
        aspectRatio={aspectRatio}
        style={useFocusAnimation(isFocused)}>
        <Image source={imageSource} style={{
          height: '100%',
          width: '100%',
        }} />
        {<Overlay isFocused={isFocused}>
          {(playable && !isFocused) && <Ionicons name={"play"} color={"white"}
                                                 size={scaledPixels(90)}
                                                 style={{ opacity: 0.8, }} />}
          {isFocused ? focusedOverlay : unfocusedOverlay}
        </Overlay>}
      </Container>
    )}
  </SpatialNavigationFocusableView>);
});

const Container = styled(Animated.View)<{
  height?: DimensionValue;
  isFocused: boolean;
  aspectRatio: number;
  inaccessible: boolean;
}>(({ height, isFocused, aspectRatio, inaccessible, theme }) => ({
  height: height || theme.sizes.carousel.card.height,
  aspectRatio: aspectRatio,
  overflow: 'hidden',
  borderRadius: scaledPixels(18),
  borderColor: isFocused ? theme.colors.primary.light : 'transparent',
  borderWidth: scaledPixels(4),
  opacity: inaccessible ? 0.2 : 1,
  cursor: 'pointer',
}));

const Overlay = styled(Center)<{
  isFocused: boolean;
}>(({ isFocused, theme }) => ({
  backgroundColor: isFocused ? "#000000cc" : "transparent",
  position: "absolute",
  flex: 1,
  justifyContent: "center",
}));

export default ImageCard;