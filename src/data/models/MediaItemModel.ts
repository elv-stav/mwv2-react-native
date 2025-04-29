import { z } from "zod";
import { DisplaySettingsModel } from "@/data/models/DisplaySettingsModel";
import { AssetLinkModel } from "@/data/models/AssetLinkModel";
import { PermissionSettings } from "@/data/models/PermissionSettings";

export const MediaItemModel = DisplaySettingsModel.extend({
  id: z.string(),
  media_file: AssetLinkModel.nullish(),
// media_link:MediaLinkDto?, // I don't think we need this anymore
  media_type: z.string().nullish(),
  type: z.string(),
  poster_image: AssetLinkModel.nullish(),
  // Media of type "list" will have a list of media item ids
  media: z.array(z.string()).nullish(),
  // Media of type "collection" will have a list of media list ids
  media_lists: z.array(z.string()).nullish(),
  gallery: z.array(z.object({
    thumbnail: AssetLinkModel.nullish(),
    thumbnail_aspect_ratio: z.string().nullish(),
  })).nullish(),

  // Live Video info
  live_video: z.boolean().nullish(),
  start_time: z.date().nullish(),
  stream_start_time: z.date().nullish(),
  end_time: z.date().nullish(),
  icons: z.array(z.object({
    icon: AssetLinkModel.nullish(),
  })).nullish(),

  // Search related stuff
  attributes: z.record(z.array(z.string())),
  // attributes: Map<String, List<String>> ?,
  tags: z.array(z.string()).nullish(),
  permissions: z.union([z.array(z.string()), PermissionSettings.nullish()]),

  // Media that is set to public=false, but also doesn't define any Permissions - is inaccessible.
  public: z.boolean().nullish(),
});

export type MediaItemModel = z.infer<typeof MediaItemModel>
