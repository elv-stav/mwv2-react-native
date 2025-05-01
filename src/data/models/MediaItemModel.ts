import { z } from "zod";
import { DisplaySettingsModel } from "@/data/models/DisplaySettingsModel";
import { AssetLinkModel } from "@/data/models/AssetLinkModel";
import { PermissionSettings } from "@/data/models/PermissionSettings";
import { nullToUndefined } from "@/data/models/zod-extensions";

export const MediaItemModel = DisplaySettingsModel.extend({
  id: z.string(),
  media_file: AssetLinkModel.nullish().transform(nullToUndefined),
// media_link:MediaLinkDto?, // I don't think we need this anymore
  media_type: z.string().nullish().transform(nullToUndefined),
  type: z.string(),
  poster_image: AssetLinkModel.nullish().transform(nullToUndefined),
  // Media of type "list" will have a list of media item ids
  media: z.array(z.string()).nullish().transform(nullToUndefined),
  // Media of type "collection" will have a list of media list ids
  media_lists: z.array(z.string()).nullish().transform(nullToUndefined),
  gallery: z.array(z.object({
    thumbnail: AssetLinkModel.nullish().transform(nullToUndefined),
    thumbnail_aspect_ratio: z.string().nullish().transform(nullToUndefined),
  })).nullish().transform(nullToUndefined),

  // Live Video info
  live_video: z.boolean().nullish().transform(nullToUndefined),
  start_time: z.string().nullish().transform(nullToUndefined),
  stream_start_time: z.string().nullish().transform(nullToUndefined),
  end_time: z.string().nullish().transform(nullToUndefined),
  icons: z.array(z.object({
    icon: AssetLinkModel.nullish().transform(nullToUndefined),
  })).nullish().transform(nullToUndefined),

  // Search related stuff
  attributes: z.record(z.array(z.string())),
  // attributes: Map<String, List<String>> ?,
  tags: z.array(z.string()).nullish().transform(nullToUndefined),
  permissions: z.union([
    z.array(z.object({ permission_item_id: z.string() })),
    PermissionSettings.nullish().transform(nullToUndefined)
  ]),

  // Media that is set to public=false, but also doesn't define any Permissions - is inaccessible.
  public: z.boolean().nullish().transform(nullToUndefined),
}).transform(obj => ({
  ...obj,
  get normalizedPermissions(): (PermissionSettings | undefined) {
    return isPermissionSettings(obj.permissions) ? obj.permissions : undefined;
  }
}));

function isPermissionSettings(f?: (PermissionSettings | any[] | null)): f is PermissionSettings {
  return !Array.isArray(f);
}

export type MediaItemModel = z.infer<typeof MediaItemModel>
