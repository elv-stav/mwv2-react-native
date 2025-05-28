import { observer } from "mobx-react-lite";
import { tokenStore } from "@/data/stores";
import { Animated, ImageSourcePropType } from "react-native";
import {
  SpatialNavigationFocusableView,
  SpatialNavigationNode,
  SpatialNavigationView
} from "react-tv-space-navigation";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { Image } from "expo-image";
import homeIcon from "@/assets/icons/home.svg";
import myItemsIcon from "@/assets/icons/my_items.svg";
import profileIcon from "@/assets/icons/profile.svg";
import { Typography } from "@/components/Typography";
import styled from "@emotion/native/dist/emotion-native.cjs";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { DimensionValue } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import useMousePosition from "@/hooks/useMousePosition";
import { useEffect, useMemo, useState } from "react";

type MenuProps = {
  onMenuCloseRequested?: () => void,
}

const MenuButton = ({ title, icon, onSelect, expand, isSelected }: {
  title: string,
  icon: ImageSourcePropType,
  onSelect: () => void,
  isSelected: boolean,
  expand: boolean
}) => {
  return <SpatialNavigationFocusableView onSelect={onSelect}>
    {({ isFocused }) => {
      const tint = FgForState(isSelected, isFocused, expand);
      return (
        <ButtonContainer isSelected={isSelected} isFocused={isFocused} isExpanded={expand}>
          <Image source={icon} style={{ width: scaledPixels(40), aspectRatio: 1 }} contentFit={"contain"} tintColor={tint} />
          {expand && <Typography style={{ color: tint }}>{title}</Typography>}
        </ButtonContainer>);
    }}
  </SpatialNavigationFocusableView>;
};

const useCloseMenuOnMouseOut = (isActive: boolean, onClose?: () => void) => {
  const { x } = useMousePosition();
  const closeMenu = useMemo(() => {
    // Close menu once cursor traveled more than 1/3 of the screen
    return isActive && (x || 0) > scaledPixels(1920 / 3);
  }, [x,/* DO NOT add [isActive] to the dep array. We only want to observe x */]);

  useEffect(() => {
    if (closeMenu) {
      // Trigger callback only once when the condition is met.
      onClose?.();
    }
  }, [closeMenu]);
};

const Menu = observer(({ onMenuCloseRequested }: MenuProps) => {
  const router = useRouter();
  const isLoggedIn = tokenStore.isLoggedIn;
  const path = usePathname();

  const [triggerMenuClose, setTriggerMenuClose] = useState(false);
  useEffect(() => {
    if (triggerMenuClose) {
      // TODO: set focus on the "selected" menu button right before closing, so it's selected next time the menu opens.
      onMenuCloseRequested?.();
      setTriggerMenuClose(false);
    }
  }, [triggerMenuClose]);

  return (<SpatialNavigationNode>
    {({ isActive }) => {
      useCloseMenuOnMouseOut(isActive, onMenuCloseRequested);
      const menuWidth = isActive ? "100%" : scaledPixels(180);
      if (!isLoggedIn) {
        // No menu while not logged in.
        // But we still have to render the SpatialNavNode to not confuse LRUD.
        return <></>;
      }
      return (
        <MenuContainer direction={"vertical"} width={menuWidth}>
          <Gradient start={{ x: 0.9, y: 0 }} end={{ x: 1, y: 0 }}
                    width={menuWidth}
                    colors={["#000000FF", "#00000099", "#00000000"]}
                    locations={[0, 0.7, 1]}
          >
            <MenuButton title={"Home"}
                        icon={homeIcon}
                        expand={isActive}
                        onSelect={() => {
                          setTriggerMenuClose(true);
                          router.dismissTo("/");
                        }}
                        isSelected={path === "/"}
            />
            <MenuButton title={"My Items"}
                        icon={myItemsIcon}
                        expand={isActive}
                        onSelect={() => {
                          setTriggerMenuClose(true);
                          Toast.show({ text1: "not impl yet" });
                        }}
                        isSelected={path === "/myitems"}
            />
            <MenuButton title={"Profile"}
                        icon={profileIcon}
                        expand={isActive}
                        onSelect={() => {
                          setTriggerMenuClose(true);
                          router.navigate("/profile");
                        }}
                        isSelected={path === "/profile"}
            />
          </Gradient>
          {/*</View>*/}
        </MenuContainer>
      );
    }}
  </SpatialNavigationNode>);
});

export default Menu;

function BgForState(isSelected: boolean,
                    isFocused: boolean) {
  if (isFocused) {
    return "#d4d4d4";
  }
  if (isSelected) {
    return "#62626266";
  }

  return "transparent";
}

function FgForState(isSelected: boolean, isFocused: boolean, isExpanded: boolean) {
  if (isFocused) {
    return "#2a2a2a";
  }

  if (isSelected || isExpanded) {
    return "#d4d4d4";
  }

  return "#525252";
}

const MenuContainer = styled(SpatialNavigationView)<{ width: DimensionValue }>(({ width, theme }) => ({
  height: "100%",
  width,
  position: "absolute",
  zIndex: 100,
}));

const Gradient = styled(LinearGradient)<{ width: DimensionValue }>(({ width, theme }) => ({
  height: "100%",
  width,
  justifyContent: "center",
  gap: scaledPixels(10),
  paddingHorizontal: scaledPixels(20),
}));

const ButtonContainer = styled(Animated.View)<{
  isSelected: boolean,
  isExpanded: boolean,
  isFocused: boolean
}>(({ isSelected, isExpanded, isFocused, theme }) => ({
  width: isExpanded ? scaledPixels(300) : "70%",
  alignItems: "center",
  flexDirection: "row",
  gap: scaledPixels(20),
  backgroundColor: BgForState(isSelected, isFocused),
  padding: theme.spacings.$7,
  borderRadius: 999, // Easiest way I found to make a "pill" button without knowing the actual size.
  justifyContent: isExpanded ? "flex-start" : "center",
}));
