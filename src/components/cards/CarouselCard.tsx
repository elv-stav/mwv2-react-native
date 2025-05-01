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

const CarouselCard = observer(({ sectionItem, context }: {
  sectionItem: SectionItemModel,
  context: PermissionContext
}) => {
  // context = { ...context, sectionItemId: sectionItem.id };
  const { thumbnail, aspectRatio } = sectionItem.thumbnailAndRatio;
  return <ImageCard
    onSelect={() => onSectionItemClick(sectionItem, { propertyId: "TODO" })}
    imageSource={thumbnail?.urlSource(theme.sizes.carousel.card.height)}
    aspectRatio={aspectRatio}
    playable={MediaTypes.isPlayable(sectionItem.media?.media_type ?? undefined)}
  />;
});

function onSectionItemClick(item: SectionItemModel, permissionContext: PermissionContext) {
  switch (item.type) {
    case "media":
      onMediaItemClick(item.media!);
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

const onMediaItemClick = (media: MediaItemModel) => {
  // Cache the item before nav
  runInAction(() => (mediaPropertyStore.mediaItems[media.id] = media));

  const permissions = media.normalizedPermissions?._content;
  if (PermissionUtil.showAlternatePage(permissions)) {
    // On tv we don't really show alt page, we just show purcahse options and later on navigate to alternate_page_id
    Log.w("IMPL: Purchase prompt");
  } else if (PermissionUtil.showPurchaseOptions()) {
    Log.w("IMPL: Purchase prompt");
  } else if (media.type === "list" || media.type === "collection") {
    console.log("TODO: show media grid");
  } else if (false /*media is a live video that hasn't started yet*/) {
    console.log("TODO: show Upcoming Video page (countdown page)");
  } else if (media.media_type === MediaTypes.VIDEO || media.media_type === MediaTypes.LIVE_VIDEO) {
    router.navigate(`/watch/${media.id}`);
  } else if (media.media_type === MediaTypes.IMAGE || media.media_type === MediaTypes.GALLERY) {
    router.navigate(`/gallery/${media.id}`);
    // } else if (media.media_file || media.media_links) {
    //   console.log("TODO: external content qr dialog");
  } else {
    Log.e("unhandled click", media);
  }
};

export default CarouselCard;
