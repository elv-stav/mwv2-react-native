import { observer } from "mobx-react-lite";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { SpatialNavigationView } from "react-tv-space-navigation";
import Menu from "@/components/menu/Menu";
import { Direction } from '@bam.tech/lrud';
import { tokenStore } from "@/data/stores";
import { Page } from "@/components/Page";

const Dashboard = observer(({}) => {
  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === 'left') {
        // toggleMenu(true);
      }
    },
    // [toggleMenu],
    [],
  );
  const router = useRouter();
  const isLoggedIn = tokenStore.isLoggedIn;
  useEffect(() => {
    if (!isLoggedIn && router.canGoBack()) {
      router.dismissTo("/");
    }
  }, [isLoggedIn]);

  return (
    <Page name={"dashboard"}>
      <SpatialNavigationView direction={"horizontal"} style={{ width: "100%", height: "100%" }}>
        <Menu />
        <Stack screenOptions={{ headerShown: false }} />
      </SpatialNavigationView>
    </Page>
  );
});

export default Dashboard;
