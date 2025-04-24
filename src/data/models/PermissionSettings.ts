import { z } from "zod";

export const PermissionSettings = z.object({
    // Permission items required to access this object.
    permission_item_ids: z.array(z.string()).nullish(),

    // Content permissions, trickles down to children.
    behavior: z.string().nullish(),
    alternate_page_id: z.string().nullish(),
    secondary_market_purchase_option: z.string().nullish(),

    // Only applies to Pages
    page_permissions: z.array(z.string()).nullish(),
    page_permissions_behavior: z.string().nullish(),
    page_permissions_alternate_page_id: z.string().nullish(),
    page_permissions_secondary_market_purchase_option: z.string().nullish(),

    // Only applies to Properties
    property_permissions: z.array(z.string()).nullish(),
    property_permissions_behavior: z.string().nullish(),
    property_permissions_alternate_page_id: z.string().nullish(),
    property_permissions_secondary_market_purchase_option: z.string().nullish(),

    // Search results permission behavior
    search_permissions_behavior: z.string().nullish(),
    search_permissions_alternate_page_id: z.string().nullish(),
    search_permissions_secondary_market_purchase_option: z.string().nullish(),
  }
);

export type PermissionSettings = z.infer<typeof PermissionSettings>
