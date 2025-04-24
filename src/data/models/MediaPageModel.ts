import { z } from "zod";
import { AssetLinkModel } from "./AssetLinkModel";

export const MediaPageModel = z.object({
    id: z.string(),
    layout: z.object({
      background_image: AssetLinkModel.nullish(),
      /** List of Section IDs */
      sections: z.array(z.string()),
    })
  }
);

export type MediaPageModel = z.infer<typeof MediaPageModel>;
