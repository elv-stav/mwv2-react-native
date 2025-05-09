import { observer } from "mobx-react-lite";
import { Typography } from "@/components/Typography";
import { useLocalSearchParams } from "expo-router";
import { mediaPropertyStore } from "@/data/stores";
import { useCallback, useMemo } from "react";
import { SectionItemModel } from "@/data/models/SectionItemModel";
import { Page } from "@/components/Page";
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationVirtualizedGrid
} from "react-tv-space-navigation";
import { useTheme } from "@emotion/react";
import CarouselCard from "@/components/cards/CarouselCard";
import { action } from "mobx";
import { PermissionContext } from "@/data/helpers/PermissionContext";

/**
 * A "View All" screen for either media lists/collections, or Sections.
 * Pass a [PermissionContext] in query params, with [mediaItemId] or [sectionId] to determine
 * which type of media grid to display.
 */
const MediaGrid = observer(({}) => {
  const { pctx } = useLocalSearchParams<{ pctx: string }>();
  const context = PermissionContext.deserialize(pctx);
  const mediaContainerId = context.mediaItemId;
  // Section ID
  const sectionId = context.sectionId;

  const items = useMemo(action(() => {
    if (mediaContainerId) {
      const container = mediaPropertyStore.mediaItems[mediaContainerId];
      const itemIds = container.media || container.media_lists;
      if (itemIds) {
        //TODO: fetch items from the store/network
      }
      return [];
    } else if (sectionId) {
      return mediaPropertyStore.sections[sectionId].content;
    } else {
      return [];
    }
  }), [mediaContainerId, sectionId]);

  const renderItem = useCallback(action(({ item }: { item: SectionItemModel }) =>
    <CarouselCard sectionItem={item} context={context} />), []);

  const theme = useTheme();

  return (<Page>
    <DefaultFocus>
      <SpatialNavigationVirtualizedGrid
        data={items}
        renderItem={renderItem}
        itemHeight={theme.sizes.carousel.card.height}
        header={
          <SpatialNavigationFocusableView>
            <Typography>TITLE</Typography>
          </SpatialNavigationFocusableView>
        }
        headerSize={60}
        numberOfColumns={4}
      />
    </DefaultFocus>
  </Page>);
});

export default MediaGrid;
