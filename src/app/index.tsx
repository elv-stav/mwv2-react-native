import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationNode,
  SpatialNavigationVirtualizedGrid
} from "react-tv-space-navigation";
import React, { useCallback, useEffect, useState } from "react";
import { Image, ImageBackground, ImageSourcePropType, StyleSheet } from "react-native";
import { useTheme } from "@emotion/react";
import { Page } from "@/components/Page";
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

  return <Page>
    <ImageBackground style={styles.container} source={bgImage} resizeMode={"cover"}>
      <DefaultFocus>
        <SpatialNavigationVirtualizedGrid
          data={data}
          renderItem={renderItem}
          numberOfColumns={5}
          headerSize={styles.logo.height + styles.logo.marginBottom}
          header={
            <SpatialNavigationFocusableView>
              <Image style={styles.logo} source={discoverLogo} resizeMode={"contain"} />
            </SpatialNavigationFocusableView>
          }
          itemHeight={theme.sizes.propertyCard.height * theme.scale.focused}
          rowContainerStyle={styles.rowStyle}
          ascendingArrow={<BottomArrow />}
          ascendingArrowContainerStyle={styles.bottomArrowContainer}
          descendingArrow={<TopArrow />}
          descendingArrowContainerStyle={styles.topArrowContainer}
          scrollInterval={150}
        />
      </DefaultFocus>
    </ImageBackground>
  </Page>;
});

export default Discover;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: theme.colors.background.mainHover,
    padding: scaledPixels(75),
    overflow: 'hidden',
  },
  rowStyle: { gap: scaledPixels(30) },
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
    width: scaledPixels(876),
    marginBottom: scaledPixels(20),
  }
});
