import { SectionItemModel } from "@/data/models/SectionItemModel";
import { PermissionContext } from "@/data/helpers/PermissionContext";
import { router } from "expo-router";
import { MediaItemModel } from "@/data/models/MediaItemModel";
import { runInAction } from "mobx";
import { mediaPropertyStore } from "@/data/stores";
import { PermissionUtil } from "@/data/helpers/PermissionUtil";
import { LiveVideoUtil } from "@/data/helpers/LiveVideoUtil";
import { MediaTypes } from "@/utils/MediaTypes";
import Log from "@/utils/Log";

function OnSectionItemClick(item: SectionItemModel, permissionContext: PermissionContext) {
  switch (item.type) {
    case "media":
      OnMediaItemClick(item.media!, permissionContext);
      break;
    case "page_link":
      // Will only work once "MediaPropertyDetails" actually uses pageId
      router.navigate(`/properties/${permissionContext.propertyId}/${item.page_id}`);
      break;
    case "subproperty_link":
      const page = item.subproperty_page_id || "";
      router.navigate(`/properties/${item.subproperty_id}/${page}`);
      break;
    case "item_purchase":
      router.navigate(`/purchase?pctx=${PermissionContext.serialize(permissionContext)}`);
      break;
    default:
      console.log(`NOT YET IMPLEMENTED! click on type: ${item.type}`);
  }
}

const OnMediaItemClick = (media: MediaItemModel, permissionContext: PermissionContext) => {
  // Cache the item before nav
  runInAction(() => (mediaPropertyStore.mediaItems[media.id] = media));

  const permissions = media.permissions?._content;
  const pctx = PermissionContext.serialize(permissionContext);
  if (PermissionUtil.showAlternatePage(permissions)) {
    // On tv we don't really show alt page, we just show purcahse options and later on navigate to alternate_page_id
    router.navigate(`/purchase?pctx=${pctx}`);
  } else if (PermissionUtil.showPurchaseOptions(permissions)) {
    router.navigate(`/purchase?pctx=${pctx}`);
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

export default OnSectionItemClick;
