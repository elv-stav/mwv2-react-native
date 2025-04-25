import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import React, { useEffect } from "react";
import { Typography } from "@/components/Typography";
import { observer } from "mobx-react-lite";
import { Page } from "@/components/Page";
import { useLocalSearchParams } from "expo-router";
import { mediaPropertyStore } from "@/data/stores";

const PropertyDetail = observer(() => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const property = mediaPropertyStore.properties.get(id);

  useEffect(() => {
    mediaPropertyStore.fetchProperties().finally();
  }, []);

  if (!property) return;

  return (
    <Page>
      <SpatialNavigationFocusableView>
        <Typography>oh hai {property.displayName}</Typography>
      </SpatialNavigationFocusableView>
    </Page>
  );
});

export default PropertyDetail;
