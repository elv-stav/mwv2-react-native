import { observer } from "mobx-react-lite";
import { SectionComponentProps } from "@/components/sections/SectionComponentProps";
import { SpatialNavigationNode, SpatialNavigationVirtualizedList } from "react-tv-space-navigation";
import { StyleSheet, View } from "react-native";
import { Typography } from "@/components/Typography";
import TvButton from "@/components/TvButton";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import CarouselCard from "@/components/cards/CarouselCard";
import Log from "@/utils/Log";
import { theme } from "@/design-system/theme/theme";
import { useCallback } from "react";
import { SectionItemModel } from "@/data/models/SectionItemModel";
import { LeftArrow, RightArrow } from "@/components/Arrows";

const CarouselSection = observer(({ section }: SectionComponentProps) => {
  const renderItem = useCallback(({ item, index }: { item: SectionItemModel, index: number }) => (
    <CarouselCard sectionItem={item} />
  ), []);
  return (
    <View style={{ height: theme.sizes.carousel.row.height, gap: theme.sizes.carousel.row.gap }}>
      <View style={styles.titleContainer}>
        <Typography>{section.display?.title}</Typography>
        <TvButton title={"View All"} />
      </View>
      <SpatialNavigationNode>
        {({ isActive }) =>
          <SpatialNavigationVirtualizedList
            orientation={"horizontal"}
            data={section.content}
            renderItem={renderItem}
            itemSize={item => theme.sizes.carousel.card.height}
            descendingArrow={isActive ? <LeftArrow /> : undefined}
            descendingArrowContainerStyle={styles.leftArrowContainer}
            ascendingArrow={isActive ? <RightArrow /> : undefined}
            ascendingArrowContainerStyle={styles.rightArrowContainer}
          />
        }
      </SpatialNavigationNode>
    </View>
  );
});

const styles = StyleSheet.create({
  titleContainer: {
    height: theme.sizes.carousel.title.height,
    flexDirection: "row",
    gap: scaledPixels(40),
    alignItems: "center",
  },
  leftArrowContainer: {
    width: 120,
    height: scaledPixels(260) + 2 * theme.spacings.$8,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    left: -theme.spacings.$8,
  },
  rightArrowContainer: {
    width: 120,
    height: scaledPixels(260) + 2 * theme.spacings.$8,
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    right: -theme.spacings.$8,
  },
});

export default CarouselSection;
