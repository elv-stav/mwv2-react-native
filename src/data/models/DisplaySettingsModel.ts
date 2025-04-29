import { z } from "zod";
import { AssetLinkModel } from "@/data/models/AssetLinkModel";

export const DisplaySettingsModel = z.object({
  title: z.string().nullish(),
  subtitle: z.string().nullish(),
  headers: z.array(z.string()).nullish(),
  description: z.string().nullish(),
  aspect_ratio: z.string().nullish(),
  thumbnail_image_landscape: AssetLinkModel.nullish(),
  thumbnail_image_portrait: AssetLinkModel.nullish(),
  thumbnail_image_square: AssetLinkModel.nullish(),

  display_limit: z.number().nullish(),
  display_limit_type: z.string().nullish(),
  display_format: z.string().nullish(),

  logo: AssetLinkModel.nullish(),
  logo_text: z.string().nullish(),
  inline_background_color: z.string().nullish(),
  inline_background_image: AssetLinkModel.nullish(),

  background_image: AssetLinkModel.nullish(),
  // background_video: PlayableHashDto? //TODO: figure out how to handle this

  hide_on_tv: z.boolean().nullish(),
});

export type DisplaySettingsModel = z.infer<typeof DisplaySettingsModel>
