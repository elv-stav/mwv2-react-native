import { z } from "zod";
import { AssetLinkModel } from "./AssetLinkModel";
import { PermissionSettings } from "@/data/models/PermissionSettings";

export const MediaPageModel = z.object({
    id: z.string(),
    layout: z.object({
      background_image: AssetLinkModel.nullish(),
      /** List of Section IDs */
      sections: z.array(z.string()),
    }),
    permissions: PermissionSettings.nullish(),
  }
);

export type MediaPageModel = z.infer<typeof MediaPageModel>;
