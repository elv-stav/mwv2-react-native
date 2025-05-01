import { z } from "zod";
import { nullToUndefined } from "@/data/models/zod-extensions";

export const ResolvedPermissionSchema = z.object({
  authorized: z.boolean(),
  permission_item_ids: z.array(z.string()).nullish().transform(nullToUndefined),
  behavior: z.string().nullish().transform(nullToUndefined),
  alternate_page_id: z.string().nullish().transform(nullToUndefined),
  secondary_market_purchase_option: z.string().nullish().transform(nullToUndefined),
});

export type ResolvedPermissions = z.infer<typeof ResolvedPermissionSchema>

// This model is used for "raw" permissions, as they obtained from the server, AND resolved permissions, after
// client-side processing.
export const PermissionSettings = z.object({
    // Only applies to "resolved" permissions. This will always come back from API as "undefined""
    authorized: z.string().nullish().transform(nullToUndefined),

    // Permission items required to access this object.
    permission_item_ids: z.array(z.string()).nullish().transform(nullToUndefined),

    // Content permissions, trickles down to children.
    behavior: z.string().nullish().transform(nullToUndefined),
    alternate_page_id: z.string().nullish().transform(nullToUndefined),
    secondary_market_purchase_option: z.string().nullish().transform(nullToUndefined),

    // Only applies to Pages
    page_permissions: z.array(z.string()).nullish().transform(nullToUndefined),
    page_permissions_behavior: z.string().nullish().transform(nullToUndefined),
    page_permissions_alternate_page_id: z.string().nullish().transform(nullToUndefined),
    page_permissions_secondary_market_purchase_option: z.string().nullish().transform(nullToUndefined),

    // Only applies to Properties
    property_permissions: z.array(z.string()).nullish().transform(nullToUndefined),
    property_permissions_behavior: z.string().nullish().transform(nullToUndefined),
    property_permissions_alternate_page_id: z.string().nullish().transform(nullToUndefined),
    property_permissions_secondary_market_purchase_option: z.string().nullish().transform(nullToUndefined),

    // Search results permission behavior
    search_permissions_behavior: z.string().nullish().transform(nullToUndefined),
    search_permissions_alternate_page_id: z.string().nullish().transform(nullToUndefined),
    search_permissions_secondary_market_purchase_option: z.string().nullish().transform(nullToUndefined),

    // Resolved permissions
    _property: ResolvedPermissionSchema.nullish().transform(nullToUndefined),
    _search: ResolvedPermissionSchema.nullish().transform(nullToUndefined),
    _page: ResolvedPermissionSchema.nullish().transform(nullToUndefined),
    _content: ResolvedPermissionSchema.nullish().transform(nullToUndefined),
  }
);

export type PermissionSettings = z.infer<typeof PermissionSettings>
