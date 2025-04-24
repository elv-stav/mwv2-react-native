import { RouteProp } from '@react-navigation/native';
import { SpatialNavigationFocusableView, SpatialNavigationNode } from "react-tv-space-navigation";
import { RootStackParamList } from "@/routing/RootStackParamList";
import React from "react";
import { Typography } from "@/components/Typography";
import { observer } from "mobx-react-lite";
import { Page } from "@/components/Page";

export const PropertyDetail = observer(({ route }: {
  route: RouteProp<RootStackParamList, 'PropertyDetail'>;
}) => {
  console.log('pp', route);
  return (
    <Page>
      <SpatialNavigationFocusableView>
        <Typography>oh hai {route.params.property.title}</Typography>
      </SpatialNavigationFocusableView>
    </Page>
  );
});

