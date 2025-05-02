import { z } from "zod";
import { DisplaySettingsModel } from "@/data/models/DisplaySettingsModel";
import { AssetLinkModel } from "@/data/models/AssetLinkModel";
import { PermissionSettings } from "@/data/models/PermissionSettings";
import { nullToUndefined } from "@/data/models/zod-extensions";

/**
 * Media items come in from the backend with a different permissions structure than other items.
 * This is the backend structure we'll parse, and then transform it to [PermissionSettings]
 */
const MediaPermissions = z.object({ permission_item_id: z.string() });
type MediaPermissions = z.infer<typeof MediaPermissions>

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
  permissions: z.array(MediaPermissions).nullish().transform(nullToUndefined),

  // Media that is set to public=false, but also doesn't define any Permissions - is inaccessible.
  public: z.boolean().nullish().transform(nullToUndefined),
}).transform(obj => ({
  ...obj,
  // Override [permissions] with the standard structure.
  permissions: normalizePermissions(obj.permissions, obj.public)
}));

/**
 * Media items have a permissions array instead of the same structure as prop/page/section.
 * Massage it to conform.
 */
function normalizePermissions(permissionItems?: MediaPermissions[], isPublic?: boolean): PermissionSettings {
  if (isPublic) {
    // Server can still send a non-empty dto.permissions list even if the item is
    // public. In that case we should ignore the list completely.
    permissionItems = [];
  }

  const itemIds: string[] = [];
  permissionItems?.forEach((permissionItem) => {
    if (permissionItem?.permission_item_id) {
      itemIds.push(permissionItem.permission_item_id);
    }
  });

  return {
    permission_item_ids: itemIds
  };
}

function isPermissionSettings(f?: (PermissionSettings | any[] | null)): f is PermissionSettings {
  return !Array.isArray(f);
}

export type MediaItemModel = z.infer<typeof MediaItemModel>
