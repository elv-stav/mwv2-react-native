import { z } from "zod";
import { AssetLinkModel } from "./AssetLinkModel";
import { PermissionSettings } from "@/data/models/PermissionSettings";
import { nullToUndefined } from "@/data/models/zod-extensions";

export const MediaPageModel = z.object({
    id: z.string(),
    layout: z.object({
      background_image: AssetLinkModel.nullish().transform(nullToUndefined),
      /** List of Section IDs */
      sections: z.array(z.string()),
    }),
    permissions: PermissionSettings.nullish().transform(nullToUndefined),
  }
);

export type MediaPageModel = z.infer<typeof MediaPageModel>;
