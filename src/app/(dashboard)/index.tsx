import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationVirtualizedGrid
} from "react-tv-space-navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Image } from "expo-image";
import { ImageBackground, ImageSourcePropType, StyleSheet } from "react-native";
import { useTheme } from "@emotion/react";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import { PropertyCard } from "@/components/cards/PropertyCard";
import discoverLogo from "@/assets/discover_logo.png";
import { theme } from "@/design-system/theme/theme";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { BottomArrow, TopArrow } from "@/components/Arrows";
import { mediaPropertyStore, tokenStore } from "@/data/stores";
import { observer } from "mobx-react-lite";
import { action } from "mobx";
import { useRouter } from "expo-router";
import Center from "@/components/Center";
import Loader from "@/components/Loader";
import { useIsFocused } from "@react-navigation/native";

const Discover = observer(() => {
  const [bgImage, setBgImage] = useState<ImageSourcePropType | undefined>(undefined);
  const data = Object.values(mediaPropertyStore.properties);
  const router = useRouter();
  const renderItem = useCallback(({ item }: { item: MediaPropertyModel }) => {
    return <PropertyCard
      property={item}
      onFocus={action(() => setBgImage(item.image_tv?.urlSource()))}
      onSelect={action(() => {
        if (tokenStore.isLoggedIn || item.login?.settings?.disable_login) {
          router.navigate(`/properties/${item.id}`);
        } else {
          router.navigate(`/signin/${item.id}`);
        }
      })} />;
  }, []);

  useEffect(() => {
    mediaPropertyStore.fetchProperties().finally();
  }, []);

  const theme = useTheme();

  // Increase left padding when logged in to accommodate for menu width
  const isLoggedIn = tokenStore.isLoggedIn;
  const padding = isLoggedIn ? { paddingLeft: scaledPixels(210) } : {};

  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      // Reset background image when leaving the Discover screen
      setBgImage(undefined);
    }
  }, [isFocused]);

  if (!isFocused) {
    // This is a workaround to prevent the Discover screen from rendering and capturing key events when in
    // the nav backstack.
    // The real fix should be wrapping each screen in a <Page>, and the Menu in its own SpatialNavigationRoot, then
    // manually managing which root is active.
    return <></>;
  }

  if (!data?.length) {
    return <Center style={styles.container}><Loader /></Center>;
  }

  return <>
    <ImageBackground style={[styles.container, padding]} source={bgImage} resizeMode={"cover"}>
      <SpatialNavigationVirtualizedGrid
        data={data}
        renderItem={renderItem}
        additionalRenderedRows={0}
        numberOfColumns={5}
        headerSize={styles.logo.height + styles.logo.marginBottom}
        header={
          <DefaultFocus>
            <SpatialNavigationFocusableView>
              <Image style={styles.logo}
                     source={discoverLogo}
                     contentPosition={"top left"}
                     contentFit={"contain"} />
            </SpatialNavigationFocusableView>
          </DefaultFocus>
        }
        itemHeight={theme.sizes.propertyCard.height + theme.sizes.propertyCard.gap}
        rowContainerStyle={styles.rowStyle}
        ascendingArrow={<BottomArrow />}
        ascendingArrowContainerStyle={styles.bottomArrowContainer}
        descendingArrow={<TopArrow />}
        descendingArrowContainerStyle={styles.topArrowContainer}
        scrollInterval={150}
      />
    </ImageBackground>
  </>;
});

export default Discover;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: theme.colors.background.mainHover,
    paddingVertical: scaledPixels(55),
    paddingHorizontal: scaledPixels(168),
    overflow: 'hidden',
  },
  rowStyle: { gap: theme.sizes.propertyCard.gap },
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
  logo: {
    height: scaledPixels(210),
    // Take up the full width of the screen, but maintain aspect ratio
    width: scaledPixels(1920),
    marginBottom: scaledPixels(30),
  }
});
