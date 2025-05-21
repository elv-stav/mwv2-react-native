import { observer } from "mobx-react-lite";
import { SectionComponentProps } from "@/components/sections/SectionComponentProps";
import { SpatialNavigationNode, SpatialNavigationVirtualizedList } from "react-tv-space-navigation";
import { StyleSheet, View } from "react-native";
import { Typography } from "@/components/Typography";
import TvButton from "@/components/TvButton";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import CarouselCard from "@/components/cards/CarouselCard";
import { theme } from "@/design-system/theme/theme";
import { useCallback, useMemo } from "react";
import { SectionItemModel } from "@/data/models/SectionItemModel";
import { LeftArrow, RightArrow } from "@/components/Arrows";
import { PermissionUtil } from "@/data/helpers/PermissionUtil";
import { Href, useRouter } from "expo-router";
import { PermissionContext } from "@/data/helpers/PermissionContext";
import styled from "@emotion/native/dist/emotion-native.cjs";

const SUPPORTED_ITEM_TYPES = [
  "media",
  "external_link", "property_link", "subproperty_link", "page_link",
  "visual_only",
  "item_purchase"
];

/**
 * The maximum number of items to display in a carousel before showing a "View All"
 * button regardless of displayLimit.
 */
const VIEW_ALL_THRESHOLD = 5;

const CarouselSection = observer(({ section, context }: SectionComponentProps) => {
  context = { ...context, sectionId: section.id };
  const display = section.display;
  // const bgImage = rootStore.ResolveUrl(display.inline_background_image_tv || display.inline_background_image);
  const title = display?.title;
  const subtitle = display?.subtitle;
  const hasTitleRow = title || subtitle;

  const isBannerSection = display?.display_format == "banner";
  const displayLimit = (!isBannerSection && display?.display_limit) || Number.MAX_VALUE;

  const items = useMemo(() => {
    const result: SectionItemModel[] = [];
    for (const item of section.content) {
      if (SUPPORTED_ITEM_TYPES.includes(item.type) && !PermissionUtil.isHidden(item.permissions?._content)) {
        result.push(item);
        // Stop rending if we reached the display limit
        if (displayLimit > 0 && result.length >= displayLimit) {
          break;
        }
      }
    }
    return result;
  }, [section]);

  const viewAllHref = useMemo((): Href | undefined => {
    if (items.length > displayLimit || items.length > VIEW_ALL_THRESHOLD) {
      return `/view?pctx=${PermissionContext.serialize(context)}`;
    } else {
      return undefined;
    }
  }, [items]);

  const renderItem = useCallback(({ item }: { item: SectionItemModel }) => (
    <CarouselCard sectionItem={item} context={context} />
  ), []);

  if (items.length === 0) {
    return null;
  }
  return (
    <View style={{ height: theme.sizes.carousel.row.height, gap: theme.sizes.carousel.row.gap }}>
      {!!hasTitleRow && <TitleRow title={title} subtitle={subtitle} viewAllHref={viewAllHref} />}
      <SpatialNavigationNode>
        {({ isActive }) =>
          <SpatialNavigationVirtualizedList
            orientation={"horizontal"}
            data={items}
            renderItem={renderItem}
            itemSize={item =>
              theme.sizes.carousel.card.height * (item.thumbnailAndRatio.aspectRatio || 1.0) * theme.scale.focused
            }
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

const TitleRow = observer(({ title, subtitle, viewAllHref }: {
  title?: string, subtitle?: string, viewAllHref?: Href
}) => {
  const router = useRouter();
  return (<>
    <View style={styles.titleContainer}>
      {(!!title || !!subtitle) && <View style={{ gap: scaledPixels(20) }}>
        {!!title && <Title>{title}</Title>}
        {!!subtitle && <Subtitle>{subtitle}</Subtitle>}
      </View>}
      {!!viewAllHref &&
        <TvButton title={"VIEW ALL"}
                  style={{ variant: 'outline', fontSize: scaledPixels(28) }}
                  onSelect={() => router.navigate(viewAllHref)} />}
    </View>
  </>);
});

const Title = styled(Typography)(() => ({
  fontSize: scaledPixels(32),
}));
const Subtitle = styled(Typography)(() => ({
  fontSize: scaledPixels(32),
  fontFamily: "Inter_100Thin",
}));

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
