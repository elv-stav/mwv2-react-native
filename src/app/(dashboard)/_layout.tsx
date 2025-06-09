import { observer } from "mobx-react-lite";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { SpatialNavigationNode, SpatialNavigationView } from "react-tv-space-navigation";
import Menu from "@/components/menu/Menu";
import { tokenStore } from "@/data/stores";
import { Page } from "@/components/Page";
import {
  SpatialNavigationNodeRef
} from "react-tv-space-navigation/src/spatial-navigation/types/SpatialNavigationNodeRef";
import Log from "@/utils/Log";

const Dashboard = observer(({}) => {
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
          // Wait 1ms before trying to focus on the content. This should give the new page time to render.
          setTimeout(() => {
            try {
              contentRef?.current?.focus?.();
            } catch (e) {
              // This should really only happen in development, when starting the app another a path that isn't "/",
              // and thus "contentRef" still hasn't rendered something that can be focused.
              // It's fine to ignore it, but the menu will just stay open instead of closing.
              Log.w("failed to assign focus to Dashboard content", e);
            }
          }, 1);
        }} />
        <SpatialNavigationNode ref={contentRef}>
          <Stack screenOptions={{ headerShown: false }} />
        </SpatialNavigationNode>
      </SpatialNavigationView>
    </Page>
  );
});

export default Dashboard;
