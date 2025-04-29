// Mostly copied from Android.
// The resolved permissions are stored in the permission object under [._content / ._page / ._property / ._search]
import Log from "@/utils/Log";

export const PermissionResolver = {
  /**
   * Recursively resolves permissions and updates entities with resolved permissions.
   * @param item can be anything that has .permissions
   * @param parentPermissions optional parent's resolved permission object
   * @param permissionStates the Property level set of every permission_item_id and whether the user is authorized to access it.
   */
  ResolvePermissions: function ({item, parentPermissions, permissionStates}) {
    _sanitizePermissions({item});

    // Special cases
    if (resolveSpecialPermissions({permissions: item.permissions, permissionStates})) {
      Log.d(`Short-circuiting content permission resolution for ${item}`);
      return;
    }

    resolveContentPermissions({item, parentPermissions, permissionStates});

    // Iterate children and update their permissions too
    const children = _getPermissionedChildren({item});
    children.forEach((child) => {
      if (child) {
        this.ResolvePermissions({item: child, parentPermissions: item.permissions._content, permissionStates});
      }
    });
  }
};

/**
 * @return {boolean} true if we can short-circuit the content permission resolution process.
 */
function resolveSpecialPermissions({permissions, permissionStates}) {
  if (permissions.property_permissions) {
    const propertyPermissions = {
      permission_item_ids: permissions.property_permissions,
      behavior: permissions.property_permissions_behavior,
      alternate_page_id: permissions.property_permissions_alternate_page_id,
      secondary_market_purchase_option: permissions.property_permissions_secondary_market_purchase_option
    };
    permissions._property = merge({parent: propertyPermissions, child: null, permissionStates});

    const searchPermissions = {
      // Default to HIDE when not defined
      behavior: permissions.search_permissions_behavior || "hide",
      alternatePageId: permissions.search_permissions_alternate_page_id,
      secondaryMarketPurchaseOption: permissions.search_permissions_secondary_market_purchase_option
    };
    permissions._search = merge({parent: searchPermissions, child: null, permissionStates});

    // An in-accessible property could still render a Page, so we can't short-circuit here.
    return false;
  } else if (permissions.page_permissions) {
    const pagePermissions = {
      permission_item_ids: permissions.page_permissions,
      behavior: permissions.page_permissions_behavior,
      alternate_page_id: permissions.page_permissions_alternate_page_id,
      secondary_market_purchase_option: permissions.page_permissions_secondary_market_purchase_option
    };

    permissions._page = merge({parent: pagePermissions, child: null, permissionStates});

    // In the case of an unauthorized page, we can save ourselves from checking any content
    // permissions, because none of that content will be visible to the user
    return permissions._page.authorized === false;
  }

  return false;
}

// Updates [item] with resolved permissions.
function resolveContentPermissions({item, parentPermissions, permissionStates}) {
  if (!parentPermissions) {
    // top level, resolve with [item] as parent.
    if (item.permissions) {
      item.permissions._content = merge({
        parent: item.permissions,
        child: null,
        permissionStates
      });
    }
  } else {
    item.permissions._content = merge({
      parent: parentPermissions,
      child: item.permissions,
      permissionStates
    });
  }
}

function merge({parent, child, permissionStates}) {
  if (!child) {
    // Child has nothing defined, [authorized] will be the same as the parent's, unless it still needs to be calculated.
    return compositePermissions({
      authorized: parent.authorized || isAuthorized({
        permissions: parent,
        permissionStates
      }),
      primary: parent,
      fallback: child
    });
  }

  if (parent.authorized === false) {
    // Parent is not authorized, everything down the line is not authorized
    // and will inherit behavior, unless it's not already set.
    return compositePermissions({authorized: false, primary: parent, fallback: child});
  }

  // Parent is authorized, child will have to check its own permissions.
  // Child fields take precedence over parent fields.
  return compositePermissions({
    authorized: isAuthorized({permissions: child, permissionStates}),
    primary: child,
    fallback: parent
  });
}

function compositePermissions({authorized, primary, fallback}) {
  fallback = fallback || {};
  let items;
  if (primary.permission_item_ids && (primary.permission_item_ids.length > 0)) {
    items = primary.permission_item_ids;
  } else {
    items = fallback.permission_item_ids;
  }
  return {
    authorized: authorized,
    permission_item_ids: items || [],
    behavior: primary.behavior || fallback.behavior,
    alternate_page_id: primary.alternate_page_id || fallback.alternate_page_id,
    secondary_market_purchase_option: primary.secondary_market_purchase_option || fallback.secondary_market_purchase_option,
  };
}

function isAuthorized({permissions, permissionStates}) {
  const permissionItems = permissions.permission_item_ids;
  // If not permissioned by any items - we're authorized
  if (!permissionItems || permissionItems.length === 0) return true;

  return permissionItems.some((item) => permissionStates[item]?.authorized);
}


/**
 * Make sure .permissions conforms to the same structure for all items
 */
function _sanitizePermissions({item}) {
  if (!item.permissions) {
    item.permissions = {};
  }

  // Media items have a permissions array instead of the same structure as prop/page/section.
  // Massage it to conform.
  if (Array.isArray(item.permissions)) {
    let permissionItems;
    if (item.public) {
      // Server can still send a non-empty dto.permissions list even if the item is
      // public. In that case we should ignore the list completely.
      permissionItems = [];
    } else {
      permissionItems = item.permissions;
    }

    const itemIds = [];
    permissionItems.forEach((permissionItem) => {
      if (permissionItem?.permission_item_id) {
        itemIds.push(permissionItem.permission_item_id);
      }
    });

    item.permissions = {
      permission_item_ids: itemIds
    };
  }

  if (item.permissions.property_permissions === undefined && item.id.startsWith("iq__")) {
    // This is a Property, make sure it also has a property_permissions object
    Log.d(`Found a page without page_permissions, creating default.`);
    item.permissions.property_permissions = [];
  }

  if (item.permissions.page_permissions === undefined && (item.id === "main" || item.id.startsWith("ppge"))) {
    // This is a Page, make sure it also has a page_permissions object
    Log.d(`Found a page without page_permissions, creating default.`);
    item.permissions.page_permissions = [];
  }
}

// Returns child objects that also have (or can have) a .permissions field that needs to be resolved
function _getPermissionedChildren({item}) {
  const children = [
    // Properties contain their main page
    item.main_page,
  ];

  // MediaLists have a list of ids under 'media', we don't care about that,
  // but we DO want SectionItem's 'media' which points to an actual media object
  if (item.media && !Array.isArray(item.media) && typeof item.media === 'object') {
    children.push(item.media);
  }

  // Sections have SectionItems in .content
  children.push(...(item.content || []));

  // "container" type Sections will have other "sub sections" in .sections_resolved
  children.push(...(item.sections_resolved || []));

  return children;
}