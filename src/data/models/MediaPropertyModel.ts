import { z } from "zod";
import { AssetLinkModel } from "./AssetLinkModel";
import { MediaPageModel } from "./MediaPageModel";
import { PermissionSettings } from "./PermissionSettings";
import { nullToUndefined } from "@/data/models/zod-extensions";

export const MediaPropertyModel = z.object({
  id: z.string(),
  name: z.string(),
  /** Use title if it exists, otherwise use [name] */
  title: z.string().nullish().transform(nullToUndefined),
  header_logo: AssetLinkModel.nullish().transform(nullToUndefined),
  tv_header_logo: AssetLinkModel.nullish().transform(nullToUndefined),
  /** This image is used to display on the discover page poster */
  image: AssetLinkModel.nullish().transform(nullToUndefined),
  /** Used as the background on the discover page when this property is selected */
  image_tv: AssetLinkModel.nullish().transform(nullToUndefined),
  main_page: MediaPageModel,
  /** Whether to show a sub-property selector */
  show_property_selection: z.boolean().nullish().transform(nullToUndefined),
  /** Sub-property info to show in selector */
  property_selection: z.array(z.object({
    property_id: z.string(),
    title: z.string().nullish().transform(nullToUndefined),
    icon: AssetLinkModel.nullish().transform(nullToUndefined),
  })).nullish().transform(nullToUndefined),

  login: z.object({
    settings: z.object({
      provider: z.string().nullish().transform(nullToUndefined),
      disable_login: z.boolean().nullish().transform(nullToUndefined)
    }).nullish().transform(nullToUndefined),
    styling: z.object({
      background_image_tv: AssetLinkModel.nullish().transform(nullToUndefined),
      background_image_desktop: AssetLinkModel.nullish().transform(nullToUndefined),
      logo_tv: AssetLinkModel.nullish().transform(nullToUndefined),
      logo: AssetLinkModel.nullish().transform(nullToUndefined),
    }).nullish().transform(nullToUndefined)
  }).nullish().transform(nullToUndefined),

  permission_auth_state: z.record(z.object({ authorized: z.boolean() })).nullish().transform(nullToUndefined),
  permissions: PermissionSettings.nullish().transform(nullToUndefined),
}).transform(obj => ({
  ...obj,

  get displayName(): string {
    return obj.title || obj.name;
  },

  get loginBackgroundImage() {
    return obj.login?.styling?.background_image_tv || obj.login?.styling?.background_image_desktop;
  }
}));

export type PermissionStates = Map<string, { authorized: boolean }>

export type MediaPropertyModel = z.infer<typeof MediaPropertyModel>;
