import { observer } from "mobx-react-lite";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { SpatialNavigationRoot, SpatialNavigationView } from "react-tv-space-navigation";
import Menu from "@/components/menu/Menu";
import { Direction } from '@bam.tech/lrud';
import Log from "@/utils/Log";
import { tokenStore } from "@/data/stores";

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
    if (!isLoggedIn) {
      router.dismissTo("/");
    }
  }, [isLoggedIn]);

  return (
    <SpatialNavigationRoot onDirectionHandledWithoutMovement={() => {
      Log.e("onDirectionHandledWithoutMovement");
    }}>
      <SpatialNavigationView direction={"horizontal"} style={{ width: "100%", height: "100%" }}>
        <Stack screenOptions={{ headerShown: false }} />
        <Menu />
      </SpatialNavigationView>
    </SpatialNavigationRoot>
  );
});

export default Dashboard;
