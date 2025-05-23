import { observer } from "mobx-react-lite";
import React from "react";
import { SectionItemModel } from "@/data/models/SectionItemModel";
import { theme } from "@/design-system/theme/theme";
import { MediaItemModel } from "@/data/models/MediaItemModel";
import { runInAction } from "mobx";
import { mediaPropertyStore } from "@/data/stores";
import { PermissionUtil } from "@/data/helpers/PermissionUtil";
import { router } from "expo-router";
import { MediaTypes } from "@/utils/MediaTypes";
import Log from "@/utils/Log";
import ImageCard from "@/components/cards/ImageCard";
import { Typography, TypographyProps } from "@/components/Typography";
import styled from "@emotion/native";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { PermissionContext } from "@/data/helpers/PermissionContext";
import { DimensionValue } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { Ionicons } from "@expo/vector-icons";
import { LiveVideoUtil } from "@/data/helpers/LiveVideoUtil";

const VideoOverlay = ({ media, containerHeight }: { media?: MediaItemModel, containerHeight: DimensionValue }) => {
  if (media?.media_type !== MediaTypes.VIDEO) {
    return null;
  }

  // TODO: add playback progress
  if (media.live_video) {
    if (LiveVideoUtil.isEnded(media)) {
      // Unclear what we should do for ended videos. Maybe never show them in the first place?
      return null;
    }
    if (LiveVideoUtil.isStreamStarted(media)) {
      return <LiveTag>LIVE</LiveTag>;
    }
    // Not ended and not started yet - show upcoming tag
    return <UpcomingTag>UPCOMING{"\n"}{LiveVideoUtil.startDateTimeString(media)}</UpcomingTag>;
  } else {
    let iconSize;
    if (typeof containerHeight === "number") {
      iconSize = containerHeight * 0.30;
    } else {
      // [height] isn't a number value, just guess something reasonable for now
      iconSize = theme.sizes.carousel.card.height * 0.30;
    }
    return <Ionicons name={"play"} color={"white"}
                     size={iconSize}
                     style={{ opacity: 0.8 }} />;
  }
};

const CarouselCard = observer(({ sectionItem, context, height }: {
  sectionItem: SectionItemModel,
  context: PermissionContext,
  height?: DimensionValue
}) => {
  context = { ...context, sectionItemId: sectionItem.id, mediaItemId: sectionItem.media?.id };
  height = height || theme.sizes.carousel.card.height;
  const { thumbnail, aspectRatio } = sectionItem.thumbnailAndRatio;
  const headers = sectionItem.display.headers?.join("\u00A0\u00A0\u00A0\u00A0");
  const title = sectionItem.display.title;
  const subtitle = sectionItem.display.subtitle;

  const permissions = sectionItem.media?.permissions?._content || sectionItem.permissions?._content;
  const showPurchaseOptions = PermissionUtil.showPurchaseOptions(permissions) || PermissionUtil.showAlternatePage(permissions);
  const isDisabled = PermissionUtil.isDisabled(permissions);

  return <>
    <ImageCard
      height={height}
      onSelect={() => !isDisabled && onSectionItemClick(sectionItem, context)}
      imageSource={thumbnail?.urlSource(theme.sizes.carousel.card.height)}
      aspectRatio={aspectRatio}
      focusedOverlay={
        <OverlayContainer>
          {!!showPurchaseOptions && <PurchaseOptionsText />}
          {!!headers && <Headers>{headers}</Headers>}
          {!!title && <Title>{title}</Title>}
          {!!subtitle && <Subtitle>{subtitle}</Subtitle>}
        </OverlayContainer>
      }
      unfocusedOverlay={<>
        <VideoOverlay media={sectionItem.media} containerHeight={height} />
        {!!showPurchaseOptions && <DimOverlay />}
      </>}
    />
    {/*
     I couldn't figure out why numberOfLines=1 makes the parent element size change,
     but with numberOfLines=2, ellipsis works fine and the parent doesn't grow.
     So instead of fighting with it, I just prefix a new blank line and change the lineHeight to compensate.
     */}
    {/*TODO: dim if disabled*/}
    <FooterText numberOfLines={2}>{"\n"}{title}</FooterText>
  </>;
});

const FooterText = styled(Typography)({
  fontFamily: "Inter_500Medium",
  fontSize: scaledPixels(20),
  lineHeight: scaledPixels(20),
});

function onSectionItemClick(item: SectionItemModel, permissionContext: PermissionContext) {
  switch (item.type) {
    case "media":
      onMediaItemClick(item.media!, permissionContext);
      break;
    case "page_link":
      // Will only work once "MediaPropertyDetails" actually uses pageId
      router.navigate(`/properties/${permissionContext.propertyId}/${item.page_id}`);
      break;
    case "subproperty_link":
      const page = item.subproperty_page_id || "";
      router.navigate(`/properties/${item.subproperty_id}/${page}`);
      break;
    default:
      console.log(`NOT YET IMPLEMENTED! click on type: ${item.type}`);
  }
}

const onMediaItemClick = (media: MediaItemModel, permissionContext: PermissionContext) => {
  // Cache the item before nav
  runInAction(() => (mediaPropertyStore.mediaItems[media.id] = media));

  const permissions = media.permissions?._content;
  const pctx = PermissionContext.serialize(permissionContext);
  if (PermissionUtil.showAlternatePage(permissions)) {
    // On tv we don't really show alt page, we just show purcahse options and later on navigate to alternate_page_id
    Toast.show({ text1: "locked item: not yet impl" });
  } else if (PermissionUtil.showPurchaseOptions(permissions)) {
    Toast.show({ text1: "locked item: not yet impl" });
  } else if (media.type === "list" || media.type === "collection") {
    router.navigate(`/view?pctx=${pctx}`);
  } else if (media.live_video && !LiveVideoUtil.isStreamStarted(media)) {
    router.navigate(`/countdown/${media.id}?pctx=${pctx}`);
  } else if (media.media_type === MediaTypes.VIDEO || media.media_type === MediaTypes.LIVE_VIDEO) {
    router.navigate(`/watch/${media.id}?pctx=${pctx}`);
  } else if (media.media_type === MediaTypes.IMAGE || media.media_type === MediaTypes.GALLERY) {
    router.navigate(`/gallery/${media.id}`);
    // } else if (media.media_file || media.media_links) {
    //   console.log("TODO: external content qr dialog");
  } else {
    Log.e("unhandled click", media);
  }
};

const PurchaseOptionsText = () => {
  return <>
    <Typography style={{
      fontFamily: "Inter_700Bold",
      fontSize: scaledPixels(24),
    }}>VIEW PURCHASE OPTIONS</Typography>
    <View style={{ flex: 1 }} />
  </>;
};

const OneLineText = ({ ...props }: TypographyProps) => <Typography numberOfLines={1} {...props} />;

const OverlayContainer = styled.View({
  width: "100%",
  height: "100%",
  justifyContent: "flex-end",
  padding: scaledPixels(32),
});

const DimOverlay = styled(OverlayContainer)({
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  position: "absolute",
});

const Headers = styled(OneLineText)({
  color: "#A5A6A8",
  fontSize: scaledPixels(18),
});

const Title = styled(OneLineText)({});

const Subtitle = styled(OneLineText)({
  color: "#818590",
  fontSize: scaledPixels(18),
});

const LiveTag = styled(Typography)({
  position: "absolute",
  bottom: 0,
  right: 0,
  margin: scaledPixels(30),
  textAlign: "center",
  backgroundColor: "red",
  fontFamily: "Inter_700Bold",
  fontSize: scaledPixels(20),
  borderRadius: scaledPixels(4),
  paddingHorizontal: scaledPixels(12),
  paddingVertical: scaledPixels(4),
});

const UpcomingTag = styled(Typography)({
  position: "absolute",
  bottom: 0,
  right: 0,
  margin: scaledPixels(30),
  textAlign: "center",
  color: "#B3B3B3",
  backgroundColor: "#272727",
  fontFamily: "Inter_500Medium",
  fontSize: scaledPixels(14),
  borderRadius: scaledPixels(4),
  paddingHorizontal: scaledPixels(12),
});

export default CarouselCard;
