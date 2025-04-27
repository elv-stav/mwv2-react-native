import { observer } from "mobx-react-lite";
import { Stack } from "expo-router";
import React, { useCallback } from "react";
import { SpatialNavigationRoot, SpatialNavigationView } from "react-tv-space-navigation";
import Menu from "@/components/menu/Menu";
import { Direction } from '@bam.tech/lrud';
import Log from "@/utils/Log";

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
  return (
    <SpatialNavigationRoot onDirectionHandledWithoutMovement={() => {
      Log.e("onDirectionHandledWithoutMovement");
    }}>
      <SpatialNavigationView direction={"horizontal"} style={{ width: "100%", height: "100%" }}>
        <Menu />
        <Stack screenOptions={{ headerShown: false }} />
      </SpatialNavigationView>
    </SpatialNavigationRoot>
  );
});

export default Dashboard;
