import Utils from "@/utils/elv-client-utils";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import { MediaPageModel } from "@/data/models/MediaPageModel";
import { MediaSectionModel } from "@/data/models/MediaSectionModel";
import { SectionItemModel } from "@/data/models/SectionItemModel";
import { MediaItemModel } from "@/data/models/MediaItemModel";
import { runInAction } from "mobx";
import { mediaPropertyStore } from "@/data/stores";

/**
 * Represents the hierarchy for a specific item.
 * This is mostly needed for the purchase flow.
 */
export type PermissionContext = {
  propertyId: string,
  pageId?: string,
  sectionId?: string,
  sectionItemId?: string,
  mediaItemId?: string,
}

/**
 * A resolved version of the context, where every defined ID is resolved to the actual entity.
 */
export type ResolvedPermissionContext = {
  property: MediaPropertyModel,
  page?: MediaPageModel,
  section?: MediaSectionModel,
  sectionItem?: SectionItemModel,
  mediaItem?: MediaItemModel,
}

export const PermissionContext = {
  serialize(obj: PermissionContext): string {
    return Utils.B58(JSON.stringify(obj));
  },
  deserialize(b58Context: string): PermissionContext {
    return JSON.parse(Utils.FromB58(b58Context));
  },
  /**
   * Resolves the context to the actual entities.
   * No new entities will be fetched from the network, entities are expected to already be in the store.
   * @param context
   */
  resolve(context: PermissionContext): ResolvedPermissionContext {
    return runInAction(() => {
      const result: ResolvedPermissionContext = { property: mediaPropertyStore.properties[context.propertyId] };
      if (context.pageId) {
        result.page = mediaPropertyStore.pages[context.propertyId]?.[context.pageId];
      }
      if (context.sectionId) {
        result.section = mediaPropertyStore.sections[context.sectionId];
      }
      if (context.sectionItemId) {
        result.sectionItem = result.section?.content?.find?.(item => item.id === context.sectionItemId);
      }
      if (context.mediaItemId) {
        result.mediaItem = mediaPropertyStore.mediaItems[context.mediaItemId];
      }
      return result;
    });
  }
};
