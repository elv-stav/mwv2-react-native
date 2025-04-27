import { observer } from "mobx-react-lite";
import { tokenStore } from "@/data/stores";
import { StyleSheet } from "react-native";
import { SpatialNavigationNode, SpatialNavigationView } from "react-tv-space-navigation";
import TvButton from "@/components/TvButton";
import { LinearGradient } from "expo-linear-gradient";
import { action } from "mobx";

type MenuProps = {
  onMenuItemSelected?: () => void,
}

const Menu = observer(({ onMenuItemSelected }: MenuProps) => {
  const isLoggedIn = tokenStore.isLoggedIn;
  if (!isLoggedIn) {
    // No menu while not logged in
    return;
  }
  return (<SpatialNavigationNode>
    {({ isActive }) => {
      return (
        <SpatialNavigationView direction={"vertical"} style={styles.container}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                          colors={["#000000FF", "#000000DD", "#00000000"]}
                          style={isActive ? styles.containerOpen : { ...styles.container, width: 90 }}>
            <TvButton title={"HOME"} />
            <TvButton title={"My Items"} />
            <TvButton title={"Profile"} />
            <TvButton title={"temp:signout"} onPress={action(() => tokenStore.signOut())} />
          </LinearGradient>
        </SpatialNavigationView>
      );
    }}
  </SpatialNavigationNode>);
});

export default Menu;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: 90,
    position: "absolute",
    zIndex: 333,
  },
  containerOpen: {
    height: "100%",
    width: 300,
    position: "absolute",
  }
});
