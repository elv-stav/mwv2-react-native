import { z } from "zod";
import { AssetLinkModel } from "./AssetLinkModel";
import { MediaPageModel } from "./MediaPageModel";
import { PermissionSettings } from "./PermissionSettings";

export const MediaPropertyModel = z.object({
  id: z.string(),
  name: z.string(),
  /** Use title if it exists, otherwise use [name] */
  title: z.string().nullish(),
  header_logo: AssetLinkModel.nullish(),
  tv_header_logo: AssetLinkModel.nullish(),
  /** This image is used to display on the discover page poster */
  image: AssetLinkModel.nullish(),
  /** Used as the background on the discover page when this property is selected */
  image_tv: AssetLinkModel.nullish(),
  main_page: MediaPageModel,
  /** Whether to show a sub-property selector */
  show_property_selection: z.boolean().nullish(),
  /** Sub-property info to show in selector */
  property_selection: z.array(z.object({
    property_id: z.string(),
    title: z.string().nullish(),
    icon: AssetLinkModel.nullish(),
  })).nullish(),

  login: z.object({
    settings: z.object({
      provider: z.string().nullish(),
      disable_login: z.boolean().nullish()
    }).nullish(),
    styling: z.object({
      background_image_tv: AssetLinkModel.nullish(),
      background_image_desktop: AssetLinkModel.nullish(),
      logo_tv: AssetLinkModel.nullish(),
      logo: AssetLinkModel.nullish(),
    }).nullish()
  }).nullish(),

  permission_auth_state: z.record(z.object({ authorized: z.boolean() })).nullish(),
  permissions: PermissionSettings.nullish(),
}).transform(obj => ({
  ...obj,

  get displayName(): string {
    return obj.title || obj.name;
  }
}));

export type MediaPropertyModel = z.infer<typeof MediaPropertyModel>;
