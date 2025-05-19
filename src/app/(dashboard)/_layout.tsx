import { observer } from "mobx-react-lite";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { SpatialNavigationNode, SpatialNavigationView } from "react-tv-space-navigation";
import Menu from "@/components/menu/Menu";
import { Direction } from '@bam.tech/lrud';
import { tokenStore } from "@/data/stores";
import { Page } from "@/components/Page";
import {
  SpatialNavigationNodeRef
} from "react-tv-space-navigation/src/spatial-navigation/types/SpatialNavigationNodeRef";
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
  const router = useRouter();
  const isLoggedIn = tokenStore.isLoggedIn;
  useEffect(() => {
    if (!isLoggedIn && router.canGoBack()) {
      router.dismissTo("/");
    }
  }, [isLoggedIn]);

  const contentRef = useRef<SpatialNavigationNodeRef>(null);

  return (
    <Page name={"dashboard"}>
      <SpatialNavigationView direction={"horizontal"} style={{ width: "100%", height: "100%" }}>
        <Menu onMenuCloseRequested={() => {
          try {
            contentRef?.current?.focus?.();
          } catch (e) {
            // This should really only happen in development, when starting the app another a path that isn't "/",
            // and thus "contentRef" still hasn't rendered something that can be focused.
            // It's fine to ignore it, but the menu will just stay open instead of closing.
            Log.w("failed to assign focus to Dashboard content", e);
          }
        }} />
        <SpatialNavigationNode ref={contentRef}>
          <Stack screenOptions={{ headerShown: false }} />
        </SpatialNavigationNode>
      </SpatialNavigationView>
    </Page>
  );
});

export default Dashboard;
