import { observer } from "mobx-react-lite";
import { Typography } from "@/components/Typography";
import { mediaPropertyStore } from "@/data/stores";
import { useCallback } from "react";
import { SectionItemModel } from "@/data/models/SectionItemModel";
import { Page } from "@/components/Page";
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationVirtualizedGrid
} from "react-tv-space-navigation";
import CarouselCard from "@/components/cards/CarouselCard";
import { toJS } from "mobx";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { StyleSheet } from "react-native";
import usePermissionContextQuery from "@/hooks/usePermissionContextQuery";
import { DisplaySettingsUtil } from "@/utils/DisplaySettingsUtil";

/**
 * A "View All" screen for either media lists/collections, or Sections.
 * Pass a [PermissionContext] in query params, with [mediaItemId] or [sectionId] to determine
 * which type of media grid to display.
 */
const MediaGrid = observer(({}) => {
  const context = usePermissionContextQuery();
  const mediaContainerId = context.mediaItemId;
  // Section ID
  const sectionId = context.sectionId;

  let grid: { items: SectionItemModel[], title?: string };
  if (mediaContainerId) {
    const container = mediaPropertyStore.mediaItems[mediaContainerId];
    const itemIds = container.media || container.media_lists || [];
    const items: SectionItemModel[] = mediaPropertyStore.ObserveMediaItems(context.propertyId, itemIds)
      .map((media): SectionItemModel => ({
        // Warp in a fake SectionItemModel, so we can use the same CarouselCard component
        id: `fake-section-item-${media.id}`,
        display: {},
        type: "media",
        media: media,
        use_media_settings: true,
        thumbnailAndRatio: DisplaySettingsUtil.getThumbnailAndRatio(media),
      }));
    grid = {
      title: container.title || "",
      items: items || []
    };
  } else if (sectionId) {
    const section = mediaPropertyStore.sections[sectionId];
    grid = {
      items: section.content,
      title: section.display?.title || "",
    };
  } else {
    grid = { items: [] };
  }

  const hasNonSquareItem = grid.items.some(item => (item.thumbnailAndRatio?.aspectRatio || 1) > 1);
  const numberOfColumns = hasNonSquareItem ? 4 : 6;

  const height = scaledPixels(240);
  const renderItem = useCallback(
    ({ item }: { item: SectionItemModel }) => <CarouselCard
      height={height}
      sectionItem={item}
      context={context} />,
    []);

  return (<Page name={"media-grid"}>
    <DefaultFocus>
      <SpatialNavigationVirtualizedGrid
        style={styles.grid}
        rowContainerStyle={styles.row}
        data={toJS(grid.items)}
        renderItem={renderItem}
        itemHeight={height + styles.row.gap}
        header={
          <SpatialNavigationFocusableView>
            <Typography style={{ fontSize: scaledPixels(32) }}>{grid.title}</Typography>
          </SpatialNavigationFocusableView>
        }
        headerSize={scaledPixels(90)}
        numberOfColumns={numberOfColumns}
      />
    </DefaultFocus>
  </Page>);
});

export default MediaGrid;

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: scaledPixels(90),
    paddingTop: scaledPixels(50)
  },
  row: {
    gap: scaledPixels(60),
    columnGap: scaledPixels(20),
  }
});
