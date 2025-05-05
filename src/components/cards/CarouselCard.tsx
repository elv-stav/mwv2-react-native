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

const CarouselCard = observer(({ sectionItem, context }: {
  sectionItem: SectionItemModel,
  context: PermissionContext
}) => {
  context = { ...context, sectionItemId: sectionItem.id, mediaItemId: sectionItem.media?.id };
  const { thumbnail, aspectRatio } = sectionItem.thumbnailAndRatio;
  const headers = sectionItem.display.headers?.join("\u00A0\u00A0\u00A0\u00A0");
  const title = sectionItem.display.title;
  const subtitle = sectionItem.display.subtitle;

  const permissions = sectionItem.media?.permissions?._content || sectionItem.permissions?._content;
  const showPurchaseOptions = PermissionUtil.showPurchaseOptions(permissions) || PermissionUtil.showAlternatePage(permissions);

  return <ImageCard
    onSelect={() => onSectionItemClick(sectionItem, context)}
    imageSource={thumbnail?.urlSource(theme.sizes.carousel.card.height)}
    aspectRatio={aspectRatio}
    playable={MediaTypes.isPlayable(sectionItem.media?.media_type ?? undefined)}
    focusedOverlay={
      <OverlayContainer>
        {!!showPurchaseOptions && <PurchaseOptionsText />}
        {!!headers && <Headers>{headers}</Headers>}
        {!!title && <Title>{title}</Title>}
        {!!subtitle && <Subtitle>{subtitle}</Subtitle>}
      </OverlayContainer>
    }
    unfocusedOverlay={<>
      {!!showPurchaseOptions && <DimOverlay />}
    </>}
  />;
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
  } else if (false /*media is a live video that hasn't started yet*/) {
    console.log("TODO: show Upcoming Video page (countdown page)");
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
      fontWeight: "bold",
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

export default CarouselCard;
