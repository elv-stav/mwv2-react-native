import { observer } from "mobx-react-lite";
import styled from "@emotion/native";
import { Animated, Image } from "react-native";
import React, { useMemo } from "react";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { useFocusAnimation } from "@/design-system/helpers/useFocusAnimation";
import { SectionItemModel } from "@/data/models/SectionItemModel";
import { DisplaySettingsUtil } from "@/utils/DisplaySettingsUtil";
import { ImageURISource } from "react-native/Libraries/Image/ImageSource";
import Utils from "@/utils/elv-client-utils";
import { theme } from "@/design-system/theme/theme";

const CarouselCard = observer(({ sectionItem, onSelect }: { sectionItem: SectionItemModel, onSelect: () => void }) => {
  const imageSource: ImageURISource | undefined = useMemo(() => {
    let display;
    if (sectionItem.use_media_settings && sectionItem.media) {
      display = sectionItem.media;
    } else {
      display = sectionItem.display;
    }
    const uri = display && DisplaySettingsUtil.getThumbnailAndRatio(display)?.thumbnail?.url();
    if (uri) {
      return { uri: Utils.ResizeImage({ imageUrl: uri, height: theme.sizes.carousel.card.height }) };
    } else {
      return undefined;
    }

  }, [sectionItem]);
  return (<SpatialNavigationFocusableView onSelect={onSelect}>
    {({ isFocused }) => (
      <Container isFocused={isFocused} style={useFocusAnimation(isFocused)}>
        <SectionItemImage source={imageSource} />
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
  borderRadius: 0,
  borderColor: isFocused ? theme.colors.primary.light : 'transparent',
  borderWidth: 2,
  cursor: 'pointer',
}));

const SectionItemImage = React.memo(
  styled(Image)({
    height: '100%',
    width: '100%',
  }),
);
export default CarouselCard;
