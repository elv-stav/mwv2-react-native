import { observer } from "mobx-react-lite";
import { Typography } from "@/components/Typography";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { mediaPropertyStore } from "@/data/stores";
import { useCallback, useState } from "react";
import { ImageURISource } from "react-native/Libraries/Image/ImageSource";
import { AspectRatio } from "@/utils/AspectRatio";
import { Page } from "@/components/Page";
import { ImageBackground, StyleSheet, View } from "react-native";
import { DisplaySettingsUtil } from "@/utils/DisplaySettingsUtil";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { SpatialNavigationVirtualizedList } from "react-tv-space-navigation";
import { theme } from "@/design-system/theme/theme";
import { LeftArrow, RightArrow } from "@/components/Arrows";
import ImageCard from "@/components/cards/ImageCard";
import Toast from "react-native-toast-message";
import { AssetLinkModel } from "@/data/models/AssetLinkModel";

type ImageData = {
  link?: AssetLinkModel;
  ratio: number;
}

const ImageGallery = observer(({}) => {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  // TODO: This only works if the media object was already cached before reaching this page.
  const media = mediaPropertyStore.mediaItems[mediaId];
  const router = useRouter();
  useFocusEffect(() => {
    if (!media) {
      // TODO: handle fetching media if it isn't already cached
      Toast.show({ text1: "Missing media, to be implemented.." });
      router.back();
    }
  });
  const [selectedImage, setSelectedImage] = useState<ImageURISource | undefined>();
  if (!media) {
    return <></>;
  }

  let content;
  if (media.gallery) {
    const images: ImageData[] = media.gallery.map((galleryItem => {
      return {
        link: galleryItem.thumbnail,
        ratio: AspectRatio.fromString(galleryItem.thumbnail_aspect_ratio) || 1,
      };
    }));
    const renderItem = useCallback(({ item }: { item: ImageData }) => {
      const [alpha, setAlpha] = useState(0.75);
      return (<View style={{ opacity: alpha }}>
          <ImageCard
            imageSource={item.link?.urlSource?.(theme.sizes.carousel.card.height)}
            aspectRatio={item.ratio}
            onFocus={() => {
              setAlpha(1);
              setSelectedImage(item.link?.urlSource?.(scaledPixels(1080)));
            }}
            onBlur={() => setAlpha(0.75)}
          />
        </View>
      );
    }, []);
    const gap = scaledPixels(30);

    content = (<ImageBackground source={selectedImage || images[0]?.link?.urlSource?.(scaledPixels(1080))}
                                resizeMode={"cover"}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  padding: scaledPixels(60),
                                  // flex-end didn't work with SpatialNavigationVirtualizedList, so I'm manually adding
                                  // enough top padding to push the thumbnail row down to where it should be
                                  paddingTop: scaledPixels(1080 - 60) - theme.sizes.carousel.card.height,
                                }}>
      <SpatialNavigationVirtualizedList
        style={{ gap: 300 }}
        orientation={"horizontal"}
        data={images}
        renderItem={renderItem}
        itemSize={item => (theme.sizes.carousel.card.height * item.ratio) + gap}
        descendingArrow={<LeftArrow />}
        descendingArrowContainerStyle={styles.leftArrowContainer}
        ascendingArrow={<RightArrow />}
        ascendingArrowContainerStyle={styles.rightArrowContainer}
      />
    </ImageBackground>);
  } else {
    const { thumbnail } = DisplaySettingsUtil.getThumbnailAndRatio(media);
    content = (<ImageBackground source={thumbnail?.urlSource?.(scaledPixels(1080))} style={{
      width: '100%',
      height: '100%',
      justifyContent: "flex-end",
    }}>
      <Typography style={{
        fontSize: scaledPixels(40),
        textAlign: "center",
        fontFamily: "Inter_700Bold",
        width: "100%",
        backgroundColor: "#000000b2",
        // @ts-ignore lineHeight as % probably only works on web
        lineHeight: "150%",
        paddingHorizontal: scaledPixels(100),
        paddingVertical: scaledPixels(90),
        color: "#ffffff",
      }}>
        {media.title}
      </Typography>
    </ImageBackground>);
  }

  return (<Page name={"ImageGallery"}>{content}</Page>);
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
