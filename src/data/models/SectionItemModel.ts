import { z } from "zod";
import { DisplaySettingsModel } from "@/data/models/DisplaySettingsModel";
import { PermissionSettings } from "@/data/models/PermissionSettings";
import { AssetLinkModel } from "@/data/models/AssetLinkModel";
import { MediaItemModel } from "@/data/models/MediaItemModel";

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
});

export type SectionItemModel = z.infer<typeof SectionItemModel>
