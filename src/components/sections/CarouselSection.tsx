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
import { Image, ImageBackground, useImage } from "expo-image";
import { MediaSectionModel } from "@/data/models/MediaSectionModel";

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

  const sectionBgImage = useMemo(() => {
    const url = section.display?.inline_background_image?.url();
    if (url) {
      return { uri: `${url}?width=${scaledPixels(1920)}` };
    }
    return null;
  }, [section.display?.inline_background_image]);
  const sectionBgColor = section.display?.inline_background_color || "transparent";

  if (items.length === 0) {
    return null;
  }

  const hasLogo = !!(section.display?.logo || section.display?.logo_text);

  return (
    <ImageBackground
      contentPosition={"top left"}
      source={sectionBgImage}
      style={{
        height: theme.sizes.carousel.row.height,
        gap: theme.sizes.carousel.row.gap,
        backgroundColor: sectionBgColor,
        paddingHorizontal: theme.sizes.carousel.contentPadding,
        paddingVertical: scaledPixels(20),
      }}>
      {!!hasTitleRow &&
        <TitleRow
          title={title}
          subtitle={subtitle}
          viewAllHref={viewAllHref}
          extraMarginLeft={hasLogo ? scaledPixels(260) : 0} />}
      <View style={{ flexDirection: "row" }}>
        <SectionLogo section={section} />
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
    </ImageBackground>
  );
});


const SectionLogo = (({ section }: { section: MediaSectionModel }) => {
  const logo = section.display?.logo?.urlSource(scaledPixels(200));
  const text = section.display?.logo_text;
  const image = useImage(logo || "");
  if (!logo && !text) {
    return null;
  }
  return (<View style={{
    alignItems: "center",
    justifyContent: "center",
    gap: scaledPixels(30),
    marginRight: scaledPixels(60),
  }}>
    <Image source={image} style={{ width: image?.width, height: image?.height }} />
    <Typography>{section.display?.logo_text}</Typography>
  </View>);
});

const TitleRow = observer(({ title, subtitle, viewAllHref, extraMarginLeft = 0 }: {
  title?: string, subtitle?: string, viewAllHref?: Href, extraMarginLeft?: number
}) => {
  const router = useRouter();
  return (<>
    <View style={[styles.titleContainer, { marginLeft: extraMarginLeft }]}>
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
