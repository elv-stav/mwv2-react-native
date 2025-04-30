import { z } from "zod";
import { DisplaySettingsModel } from "@/data/models/DisplaySettingsModel";
import { PermissionSettings } from "@/data/models/PermissionSettings";
import { AssetLinkModel } from "@/data/models/AssetLinkModel";
import { MediaItemModel } from "@/data/models/MediaItemModel";
import { DisplaySettingsUtil, ThumbnailAndRatio } from "@/utils/DisplaySettingsUtil";
import { merge } from "@/utils/merge";

export const SectionItemModel = z.object({
  id: z.string(),
  type: z.string(),
  media_type: z.string().nullish(),
  media: MediaItemModel.nullish(),
  use_media_settings: z.boolean().nullish(),

  // Subproperty link data
  subproperty_id: z.string().nullish(),
  subproperty_page_id: z.string().nullish(),


  // Property link data
  property_id: z.string().nullish(),
  property_page_id: z.string().nullish(),

  // Page link data
  page_id: z.string().nullish(),

  display: DisplaySettingsModel.nullish(),
  permissions: PermissionSettings.nullish(),

  // SectionsItems inside a Banner section will have this field defined
  banner_image: AssetLinkModel.nullish(),

  // External link data
  url: z.string().nullish(),
}).transform(obj => {
  let display: DisplaySettingsModel;
  if (obj.use_media_settings && obj.media) {
    display = merge(obj.media, obj.display);
  } else {
    display = merge(obj.display, obj.media);
  }
  const thumbnailAndRatio: ThumbnailAndRatio = display && DisplaySettingsUtil.getThumbnailAndRatio(display) || {};
  return ({
    ...obj,
    // Override display with the merged display that includes media settings.
    display,
    thumbnailAndRatio,
  });
});

export type SectionItemModel = z.infer<typeof SectionItemModel>

export enum SectionTypes {
  MANUAL = "manual",
  AUTOMATIC = "automatic",
  SEARCH = "search",
  HERO = "hero",
  CONTAINER = "container",
}
