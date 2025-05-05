import { observer } from "mobx-react-lite";
import { Typography } from "@/components/Typography";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { mediaPropertyStore } from "@/data/stores";
import { useCallback, useState } from "react";
import { ImageURISource } from "react-native/Libraries/Image/ImageSource";
import { AspectRatio } from "@/utils/AspectRatio";
import { Page } from "@/components/Page";
import { ImageBackground, StyleSheet } from "react-native";
import { DisplaySettingsUtil } from "@/utils/DisplaySettingsUtil";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { SpatialNavigationVirtualizedList } from "react-tv-space-navigation";
import { theme } from "@/design-system/theme/theme";
import { LeftArrow, RightArrow } from "@/components/Arrows";
import ImageCard from "@/components/cards/ImageCard";

type ImageData = {
  url: ImageURISource | undefined;
  ratio: number | null;
}

const ImageGallery = observer(({}) => {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  // TODO: This only works if the media object was already cached before reaching this page.
  const media = mediaPropertyStore.mediaItems[mediaId];
  const router = useRouter();
  useFocusEffect(() => {
    if (!media) {
      // TODO: handle fetching media if it isn't already cached
      router.back();
    }
  });
  const [selectedImage, setSelectedImage] = useState<ImageURISource | undefined>();
  if (!media) {
    return <></>;
  }
  if (media.gallery) {
    const images: ImageData[] = media.gallery.map((galleryItem => {
      return {
        url: galleryItem.thumbnail?.urlSource(),
        ratio: AspectRatio.fromString(galleryItem.thumbnail_aspect_ratio)
      };
    }));
    const renderItem = useCallback(({ item }: { item: ImageData }) => (
      <ImageCard imageSource={item.url} onFocus={() => {
        setSelectedImage(item.url);
      }} />), []);
    return (<Page>
      <ImageBackground source={selectedImage || images[0]?.url}
                       resizeMode={"cover"}
                       style={{
                         width: '100%',
                         height: '100%',
                         justifyContent: "flex-end",
                         flexDirection: "column"
                       }}>
        {
          <SpatialNavigationVirtualizedList
            orientation={"horizontal"}
            data={images}
            renderItem={renderItem}
            itemSize={theme.sizes.carousel.card.height}
            descendingArrow={<LeftArrow />}
            descendingArrowContainerStyle={styles.leftArrowContainer}
            ascendingArrow={<RightArrow />}
            ascendingArrowContainerStyle={styles.rightArrowContainer}
          />
        }
      </ImageBackground>
    </Page>);
  } else {
    const { thumbnail } = DisplaySettingsUtil.getThumbnailAndRatio(media);
    return <ImageBackground source={thumbnail?.urlSource()} style={{
      width: '100%',
      height: '100%',
      justifyContent: "flex-end",
    }}>
      {/*@ts-ignore lineHeight as % probably only works on web */}
      <Typography style={{
        fontSize: scaledPixels(40),
        textAlign: "center",
        fontWeight: "700",
        width: "100%",
        backgroundColor: "#000000b2",
        lineHeight: "150%",
        paddingHorizontal: scaledPixels(100),
        paddingVertical: scaledPixels(90),
        color: "#ffffff",
      }}>
        {media.title}
      </Typography>
    </ImageBackground>;
  }
});

const styles = StyleSheet.create({
  leftArrowContainer: {
    width: 120,
    height: scaledPixels(260) + 2 * theme.spacings.$8,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    left: -theme.spacings.$8,
  },
  rightArrowContainer: {
    width: 120,
    height: scaledPixels(260) + 2 * theme.spacings.$8,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    right: -theme.spacings.$8,
  },
});


export default ImageGallery;
