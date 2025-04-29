/**
 * Represents the hierarchy for a specific item.
 * This is mostly needed for the purchase flow.
 */
type PermissionContext = {
  propertyId: string,
  pageId?: string,
  sectionId?: string,
  sectionItemId?: string,
  mediaItemId?: string,
}
