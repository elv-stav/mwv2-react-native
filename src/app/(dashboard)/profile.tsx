import { observer } from "mobx-react-lite";
import { Typography } from "@/components/Typography";
import { SpatialNavigationView } from "react-tv-space-navigation";
import TvButton from "@/components/TvButton";
import { theme } from "@/design-system/theme/theme";
import { fabricConfigStore, tokenStore } from "@/data/stores";
import { StyleSheet, View } from "react-native";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import Utils from "@/utils/elv-client-utils";
import { useCallback, useRef } from "react";
import {
  SpatialNavigationNodeRef
} from "react-tv-space-navigation/src/spatial-navigation/types/SpatialNavigationNodeRef";
import { useFocusEffect } from "expo-router";

const Profile = observer(({}) => {
  const walletHash = Utils.AddressToHash(tokenStore.walletAddress ?? "");
  const config = fabricConfigStore.config;
  const buttonRef = useRef<SpatialNavigationNodeRef>(null);
  useFocusEffect(useCallback(() => {
    buttonRef?.current?.focus?.();
  }, [buttonRef]));
  return (<>
    <SpatialNavigationView direction={"vertical"} style={styles.container}>
      <View style={styles.infoContainer}>
        <Typography style={styles.title}>PROFILE</Typography>
        <Typography style={styles.infoRow}>Address: {tokenStore.walletAddress}</Typography>
        <Typography style={styles.infoRow}>User Id: {`iusr${walletHash}`}</Typography>

        <Typography style={styles.title}>FABRIC</Typography>
        {/*Hardcoded to main for now*/}
        <Typography style={styles.infoRow}>Network: main</Typography>
        <Typography style={styles.infoRow}>Fabric node: {`${config?.fabricBaseUrl}`}</Typography>
        <Typography style={styles.infoRow}>Authority Service: {`${config?.authdBaseUrl}`}</Typography>
        <Typography style={styles.infoRow}>Eth Service: {`${config?.network.services.ethereum_api[0]}`}</Typography>

        <View style={styles.buttonContainer}>
          <TvButton
            buttonRef={buttonRef}
            title={"Sign Out"}
            onSelect={() => tokenStore.signOut()} />
        </View>
      </View>
    </SpatialNavigationView>
  </>);
});

export default Profile;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: theme.colors.background.main,
    height: "100%",
    justifyContent: "center",
  },
  infoContainer: {
    width: "60%",
    justifyContent: "center",
    alignSelf: "center"
  },
  title: {
    opacity: 0.6,
    paddingLeft: scaledPixels(24),
  },
  infoRow: {
    backgroundColor: "#232323",
    margin: scaledPixels(12),
    padding: scaledPixels(20),
    borderRadius: scaledPixels(8),
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: scaledPixels(30),
  },
});
