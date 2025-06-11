import React, { useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Page } from "@/components/Page";
import { Router, useLocalSearchParams, useRouter } from "expo-router";
import { mediaPropertyStore, tokenStore } from "@/data/stores";
import { action, autorun, runInAction } from "mobx";
import Loader from "@/components/Loader";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import { MediaPageModel } from "@/data/models/MediaPageModel";
import { PermissionUtil } from "@/data/helpers/PermissionUtil";
import Log from "@/utils/Log";
import { MediaSectionModel } from "@/data/models/MediaSectionModel";
import { SectionTypes } from "@/data/models/SectionItemModel";
import { ImageBackground } from "react-native";
import {
  SpatialNavigationNodeRef
} from "react-tv-space-navigation/src/spatial-navigation/types/SpatialNavigationNodeRef";
import RemoteControlManager from "@/remote-control/RemoteControlManager";
import { PermissionContext } from "@/data/helpers/PermissionContext";
import { SupportedKeys } from "@/remote-control/SupportedKeys";
import Center from "@/components/Center";
import SectionsList from "@/components/sections/SectionsList";
import useFocusEffectMemo from "@/hooks/useFocusEffectMemo";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";

const PropertyDetail = observer(() => {
  const { propertyId, pageId } = useLocalSearchParams<{ propertyId: string, pageId?: string }>();
  const property: (MediaPropertyModel | undefined) = mediaPropertyStore.observeProperty(propertyId);
  const [viewData, setViewData] = useState<PropertyDetailViewProps | undefined>(undefined);

  const router = useRouter();
  useFocusEffectMemo(action(() => {
    if (property && !property.login?.settings?.disable_login && !tokenStore.isLoggedIn) {
      router.dismissTo("/");
    }
  }), [property, tokenStore.isLoggedIn]);

  useFocusEffectMemo(() => {
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
    return <Center><Loader /></Center>;
  }
  return <PropertyDetailView {...viewData} />;
});

type PropertyDetailViewProps = {
  property: MediaPropertyModel,
  page: MediaPageModel,
  sections: MediaSectionModel[]
}

const PropertyDetailView = observer(({ property, page, sections }: PropertyDetailViewProps) => {
  const bgUrl = useMemo(() =>
    sections
      .find(section => section.type === SectionTypes.HERO)
      ?.hero_items
      ?.find(item => item.display?.background_image)
      ?.display?.background_image?.urlSource(scaledPixels(1080))
    || page.layout.background_image?.urlSource(scaledPixels(1080)), [sections]);

  const permissionContext: PermissionContext = {
    propertyId: property.id,
    pageId: page.id,
  };

  // We're not setting <DefaultFocus> on the Page. But on the first keydown event,
  // we'll focus the sections, skipping the Search button.
  // TODO(stav): there's a bug here that users going from mouse to keyboard navigation,
  //  will have their first keyboard event consumed.
  const sectionsNodeRef = useRef<SpatialNavigationNodeRef | null>(null);
  useFocusEffectMemo(() => {
    const remoteControlListener = (key: SupportedKeys) => {
      if (key === SupportedKeys.Back) {
        // Don't capture "Back" presses, let them go to the router.
        return false;
      }
      sectionsNodeRef?.current?.focus();
      // First key handled, remove the listener.
      RemoteControlManager.removeKeydownListener(remoteControlListener);
      return true;
    };
    RemoteControlManager.addKeydownListener(remoteControlListener);
    return () => RemoteControlManager.removeKeydownListener(remoteControlListener);
  }, []);

  return (<Page name={"propdetail"}>
    <ImageBackground source={bgUrl} resizeMode={"cover"} style={{ flex: 1 }}>
      <SectionsList
        sections={sections}
        permissionContext={permissionContext}
        listRef={sectionsNodeRef}
        searchHref={`/search/${property.id}`} />
    </ImageBackground>
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
    const pctx = PermissionContext.serialize({
      propertyId: property.id,
      pageId: page.id,
    });
    router.replace(`/purchase?pctx=${pctx}`);
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

export default PropertyDetail;
