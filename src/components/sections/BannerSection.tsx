import React, { useMemo } from "react";
import Log from "@/utils/Log";
import { Animated, View } from "react-native";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { Image, useImage } from "expo-image";
import { useFocusAnimation } from "@/design-system/helpers/useFocusAnimation";
import styled from "@emotion/native/dist/emotion-native.cjs";
import { SectionItemModel } from "@/data/models/SectionItemModel";
import { PermissionContext } from "@/data/helpers/PermissionContext";
import onSectionItemClick from "@/components/sections/OnSectionItemClick";

export const BannerSection = ({ items, context }: { items: SectionItemModel[], context: PermissionContext }) => {
  const banners = useMemo(() =>
    items.filter(item => {
      if (item.banner_image) {
        return true;
      } else {
        Log.w("Section item inside a Banner section, doesn't have a banner image configured");
        return false;
      }
    }), [items]);
  return <View style={{ flex: 1, gap: scaledPixels(40) }}>
    {banners.map(item => {
      let source: any = item.banner_image?.url();
      if (source) {
        // Clamp the width to the full screen width. It's bigger than what we need, but close enough.
        source = { uri: `${source}?width=${scaledPixels(1920)}` };
      }
      const image = useImage(source || "", {
        onError() {
          Log.i("BannerSection: Failed to load image", source);
        }
      });
      return (<SpatialNavigationFocusableView key={item.id} onSelect={() => onSectionItemClick(item, context)}>
        {({ isFocused }) => (
          <Container isFocused={isFocused} style={useFocusAnimation(isFocused)}>
            {!!image && <Image source={image} style={{ aspectRatio: image.width / image.height }} />}
          </Container>
        )}
      </SpatialNavigationFocusableView>);
    })}
  </View>;
};

const Container = styled(Animated.View)<{
  isFocused: boolean;
}>(({ isFocused, theme }) => ({
  borderRadius: 0,
  borderColor: isFocused ? theme.colors.primary.light : 'transparent',
  borderWidth: 2,
  cursor: 'pointer',
}));

export default BannerSection;
