import { MediaSectionModel } from "@/data/models/MediaSectionModel";
import { PermissionContext } from "@/data/helpers/PermissionContext";

export type SectionComponentProps = {
  section: MediaSectionModel,
  context: PermissionContext,
}
