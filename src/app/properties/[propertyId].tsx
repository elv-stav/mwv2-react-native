import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import React, { useEffect, useState } from "react";
import { Typography } from "@/components/Typography";
import { observer } from "mobx-react-lite";
import { Page } from "@/components/Page";
import { Router, useLocalSearchParams, useRouter } from "expo-router";
import { mediaPropertyStore, rootStore, tokenStore } from "@/data/stores";
import { action, autorun, runInAction } from "mobx";
import Loader from "@/components/Loader";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import { MediaPageModel } from "@/data/models/MediaPageModel";
import { PermissionUtil } from "@/data/helpers/PermissionUtil";
import Log from "@/utils/Log";
import { Dict } from "@/utils/Dict";
import { MediaSectionModel } from "@/data/models/MediaSectionModel";
import Utils from "@/utils/elv-client-utils";

const PropertyDetail = observer(() => {
  const { propertyId, pageId } = useLocalSearchParams<{ propertyId: string, pageId?: string }>();
  const property: (MediaPropertyModel | undefined) = mediaPropertyStore.observeProperty(propertyId);
  const [viewData, setViewData] = useState<PropertyDetailViewProps | undefined>(undefined);

  const router = useRouter();
  useEffect(action(() => {
    if (property && !property.login?.settings?.disable_login && !tokenStore.isLoggedIn) {
      router.dismissTo("/");
    }
  }), [property, tokenStore.isLoggedIn]);

  useEffect(() => {
    if (!property) {
      return;
    }
    return autorun(async () => {
      let page = await mediaPropertyStore.getPageById({ property, pageId });
      page = await getFirstAuthorizedPage({ property, page, router });
      const sections = await runInAction(() => mediaPropertyStore.fetchSections(property, page));
      setViewData({ property, page, sections });
    });
  }, [property, pageId]);

  if (!property || !viewData) {
    return <Loader />;
  }
  return <PropertyDetailView {...viewData} />;
});

type PropertyDetailViewProps = {
  property: MediaPropertyModel,
  page: MediaPageModel,
  sections: MediaSectionModel[]
}

const PropertyDetailView = observer(({ property, page, sections, }: PropertyDetailViewProps) => {
  return (<Page>
    <SpatialNavigationFocusableView>
      <Typography>oh hai {property.displayName}</Typography>
    </SpatialNavigationFocusableView>
  </Page>);
});

/**
 * Finds and returns the first Page we are authorized to view.
 * If no such page exists, this method will use [navigate] to nav to an appropriate purchase options page.
 */
const getFirstAuthorizedPage = action(async ({ property, page, visitedPageIds = new Set(), router }: {
  property: MediaPropertyModel,
  page?: MediaPageModel,
  visitedPageIds?: Set<string>,
  router: Router
}): Promise<MediaPageModel> => {
  // Redirect function fetches the next page object and recursively checks permissions
  const redirect = action(async (redirectPageId: string | undefined | null) => {
    redirectPageId = redirectPageId || undefined;
    const nextPage = await mediaPropertyStore.getPageById({ property, pageId: redirectPageId });
    return getFirstAuthorizedPage({ property, page: nextPage, visitedPageIds, router });
  });

  const permissions = page?.permissions?._page;
  if (!permissions) {
    // No specific page provided, check Property permissions
    if (PermissionUtil.showAlternatePage(property.permissions?._property)) {
      Log.d(`Property not authorized, redirecting to alternate page`);
      return await redirect(property.permissions?._property?.alternate_page_id);
    } else if (PermissionUtil.showPurchaseOptions(property.permissions?._property)) {
      // Property purchase options currently not supported
      throw "Property purchase option not implemented";
    } else {
      // We're authorized to view the property, default to main_page and check its permissions
      return getFirstAuthorizedPage({ property, page: property.main_page, visitedPageIds, router });
    }
  } else if (PermissionUtil.showPurchaseOptions(permissions)) {
    // Show purchase options page

    const permissionContext: PermissionContext = {
      propertyId: property.id,
      pageId: page.id,
    };
    const purchaseUrl = await buildPurchaseUrl(
      permissionContext,
      permissions.permission_item_ids || [],
      permissions.secondary_market_purchase_option,
    );
    router.replace(`/properties/${property.id}/${page.id}/purchase/${Utils.B64(purchaseUrl)}`);
    return Promise.reject("No authorized page, navigated to purchase options");
  } else {
    // This is a request for a specific page, ignore Property permissions, or we'll get stuck in a never-ending loop.
    const shouldRedirect = PermissionUtil.showAlternatePage(permissions);
    const redirectPageId = shouldRedirect ? permissions.alternate_page_id : null;
    if (permissions.authorized) {
      Log.d(`Authorized to view page ${page.id}`);
      return page;
    } else if (redirectPageId && (redirectPageId === page.id || visitedPageIds.has(redirectPageId))) {
      // We already checked this page id, or this is a self-reference.
      // Either way we've completed a cycle without finding a page we are allowed to view.
      Log.d(`FIXME: Circular page permission problem!`);
      router.back();
      return Promise.reject("No authorized page, circular page permission problem!");
    } else {
      // Page is unauthorized, but redirect is valid
      Log.d(`Reached unauthorized page ${page.id}, redirecting to ${redirectPageId}`);
      visitedPageIds.add(page.id);
      return await redirect(redirectPageId);
    }
  }
});

const buildPurchaseUrl = async (permissionContext: PermissionContext, permissionItemIds: string[], secondaryMarketPurchaseOption?: string | null) => {
  const context: Dict<any> = {
    "type": "purchase"
  };

  // Start from the most broad id and keep overriding with more specific ids.
  // Any field that is [null] will not override the previous value.
  context.id = permissionContext.propertyId;
  context.id = permissionContext.pageId;
  context.id = permissionContext.sectionId;
  context.id = permissionContext.sectionItemId;
  context.id = permissionContext.mediaItemId;

  // Everything else we have explicitly specified.
  context.sectionSlugOrId = permissionContext.sectionId;
  context.sectionItemId = permissionContext.sectionItemId;
  permissionItemIds = permissionItemIds.filter((x) => x);
  if (permissionItemIds.length > 0) {
    context.permissionItemIds = permissionItemIds;
  }
  context.secondaryPurchaseOption = secondaryMarketPurchaseOption;

  const auth = {
    clusterToken: tokenStore.clusterToken,
    address: tokenStore.walletAddress,
    email: tokenStore.userEmail,
  };

  // Hardcoded to Main network. No demov3 support.
  const url = new URL("https://wallet.contentfabric.io/");
  url.pathname += permissionContext.propertyId + "/";
  url.pathname += permissionContext.pageId;
  if (context) {
    url.searchParams.append("p", Utils.B58(JSON.stringify(context)));
  }
  url.searchParams.append("authorization", Utils.B58(JSON.stringify(auth)));
  return rootStore.CreateShortURL(url.toString());
};


export default PropertyDetail;
