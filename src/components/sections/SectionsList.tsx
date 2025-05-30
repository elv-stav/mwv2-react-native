import { MediaSectionModel } from "@/data/models/MediaSectionModel";
import { PermissionContext } from "@/data/helpers/PermissionContext";
import React, { MutableRefObject } from "react";
import {
  SpatialNavigationNodeRef
} from "react-tv-space-navigation/src/spatial-navigation/types/SpatialNavigationNodeRef";
import { Href, useRouter } from "expo-router";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { SpatialNavigationNode, SpatialNavigationScrollView } from "react-tv-space-navigation";
import { BottomArrow, TopArrow } from "@/components/Arrows";
import { StyleSheet, View } from "react-native";
import TvIconButton from "@/components/TvIconButton";
import { action } from "mobx";
import { SectionTypes } from "@/data/models/SectionItemModel";
import CarouselSection from "@/components/sections/CarouselSection";
import HeroSection from "@/components/sections/HeroSection";
import ContainerSection from "@/components/sections/ContainerSection";

type Props = {
  sections: MediaSectionModel[],
  permissionContext: PermissionContext,
  listRef?: MutableRefObject<SpatialNavigationNodeRef | null>,
  searchHref?: Href
}

const SectionsList = ({ sections, permissionContext, listRef, searchHref }: Props) => {
  const offset = scaledPixels(500);
  const router = useRouter();

  return <SpatialNavigationScrollView
    offsetFromStart={offset}
    style={{ overflow: "visible" }}
    ascendingArrow={<BottomArrow />}
    ascendingArrowContainerStyle={styles.bottomArrowContainer}
    descendingArrow={<TopArrow />}
    descendingArrowContainerStyle={styles.topArrowContainer}
  >
    {!!searchHref && <View style={styles.searchButtonContainer}>
      <TvIconButton
        icon={"search"}
        size={scaledPixels(64)}
        onSelect={() => router.navigate(searchHref)} />
    </View>}
    <SpatialNavigationNode ref={listRef}>
      <>
        {
          sections.map(section => {
            switch (section.type) {
              case SectionTypes.AUTOMATIC:
              case SectionTypes.MANUAL:
              case SectionTypes.SEARCH:
                return <CarouselSection key={section.id} section={section} context={permissionContext} />;
              case SectionTypes.HERO:
                return <HeroSection key={section.id} section={section} context={permissionContext} />;
              case SectionTypes.CONTAINER:
                return <ContainerSection key={section.id} section={section} context={permissionContext} />;
              default:
                return <></>;
            }
          })
        }
        {/*Empty row to make the last focusable row slide up a little higher*/}
        <View style={{ height: offset }} />
      </>
    </SpatialNavigationNode>
  </SpatialNavigationScrollView>;
};

const styles = StyleSheet.create({
  searchButtonContainer: {
    alignSelf: "flex-end",
    padding: scaledPixels(48),
  },
  topArrowContainer: {
    width: '100%',
    height: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
  },
  bottomArrowContainer: {
    width: '100%',
    height: 100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: -15,
    left: 0,
  },
});

export default SectionsList;
