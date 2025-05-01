import { z } from "zod";
import { AssetLinkModel } from "@/data/models/AssetLinkModel";
import { nullToUndefined } from "@/data/models/zod-extensions";

export const DisplaySettingsModel = z.object({
  title: z.string().nullish().transform(nullToUndefined),
  subtitle: z.string().nullish().transform(nullToUndefined),
  headers: z.array(z.string()).nullish().transform(nullToUndefined),
  description: z.string().nullish().transform(nullToUndefined),
  aspect_ratio: z.string().nullish().transform(nullToUndefined),
  thumbnail_image_landscape: AssetLinkModel.nullish().transform(nullToUndefined),
  thumbnail_image_portrait: AssetLinkModel.nullish().transform(nullToUndefined),
  thumbnail_image_square: AssetLinkModel.nullish().transform(nullToUndefined),

  display_limit: z.number().nullish().transform(nullToUndefined),
  display_limit_type: z.string().nullish().transform(nullToUndefined),
  display_format: z.string().nullish().transform(nullToUndefined),

  logo: AssetLinkModel.nullish().transform(nullToUndefined),
  logo_text: z.string().nullish().transform(nullToUndefined),
  inline_background_color: z.string().nullish().transform(nullToUndefined),
  inline_background_image: AssetLinkModel.nullish().transform(nullToUndefined),

  background_image: AssetLinkModel.nullish().transform(nullToUndefined),
  // background_video: PlayableHashDto? //TODO: figure out how to handle this

  hide_on_tv: z.boolean().nullish().transform(nullToUndefined),
});

export type DisplaySettingsModel = z.infer<typeof DisplaySettingsModel>
