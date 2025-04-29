import { z } from "zod";
import { PermissionSettings } from "@/data/models/PermissionSettings";
import { SectionItemModel } from "@/data/models/SectionItemModel";
import { DisplaySettingsModel } from "@/data/models/DisplaySettingsModel";

/**
 * We can't have zod type reference themselves, so in order for sections to contain other sections in [sections_resolved],
 * We just define everything but that field first, then extend it.
 * There's the option to create a fully recursive type (see: https://github.com/colinhacks/zod#recursive-types),
 * but since sub-sections can't themselves be containers, this approach is fine for now
 */
const MediaSectionModelWithoutSubsections = z.object({
  content: z.array(SectionItemModel),

  hero_items: z.array(z.object({
    id: z.string(),
    display: DisplaySettingsModel.nullish(),
  })).nullish(),

  description: z.string().nullish(),
  id: z.string(),
  type: z.string(),
  display: DisplaySettingsModel.nullish(),

  permissions: PermissionSettings.nullish(),
});

export const MediaSectionModel = MediaSectionModelWithoutSubsections.extend({
  // Section of type "container" will have this field defined (assuming ?resolve_subsections=true)
  sections_resolved: z.array(MediaSectionModelWithoutSubsections).nullish()
});

export type MediaSectionModel = z.infer<typeof MediaSectionModel>
