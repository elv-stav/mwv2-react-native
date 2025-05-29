import { observer } from "mobx-react-lite";
import { Typography } from "@/components/Typography";
import { mediaPropertyStore } from "@/data/stores";
import { useCallback, useMemo, useState } from "react";
import { SectionItemModel } from "@/data/models/SectionItemModel";
import { Page } from "@/components/Page";
import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationVirtualizedGrid
} from "react-tv-space-navigation";
import CarouselCard from "@/components/cards/CarouselCard";
import { action } from "mobx";
import Toast from "react-native-toast-message";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { StyleSheet } from "react-native";
import usePermissionContextQuery from "@/hooks/usePermissionContextQuery";

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
  const [title, setTitle] = useState("");

  const items = useMemo(action(() => {
    if (mediaContainerId) {
      const container = mediaPropertyStore.mediaItems[mediaContainerId];
      const itemIds = container.media || container.media_lists;
      if (itemIds) {
        //TODO: fetch items from the store/network
        Toast.show({ text1: "Media collections/lists not supported yet" });
      }
      return [];
    } else if (sectionId) {
      const section = mediaPropertyStore.sections[sectionId];
      setTitle(section.display?.title || "");
      return section.content;
    } else {
      return [];
    }
  }), [mediaContainerId, sectionId]);

  const height = scaledPixels(240);
  const renderItem = useCallback(
    action(({ item }: { item: SectionItemModel }) =>
      <CarouselCard height={height} sectionItem={item} context={context} />),
    []);


  return (<Page name={"media-grid"}>
    <DefaultFocus>
      <SpatialNavigationVirtualizedGrid
        style={styles.grid}
        rowContainerStyle={styles.row}
        data={items}
        renderItem={renderItem}
        itemHeight={height + styles.row.gap}
        header={
          <SpatialNavigationFocusableView>
            <Typography style={{ fontSize: scaledPixels(32) }}>{title}</Typography>
          </SpatialNavigationFocusableView>
        }
        headerSize={scaledPixels(90)}
        numberOfColumns={4}
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
    gap: scaledPixels(20),
  }
});
