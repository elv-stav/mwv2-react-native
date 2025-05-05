import Utils from "@/utils/elv-client-utils";

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

export const PermissionContext = {
  serialize(obj: PermissionContext): string {
    return Utils.B58(JSON.stringify(obj));
  },
  deserialize(b58Context: string): PermissionContext {
    return JSON.parse(Utils.FromB58(b58Context));
  }
};
