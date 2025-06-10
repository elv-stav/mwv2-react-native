import React from "react";
import { SpatialNavigationView } from "react-tv-space-navigation";
import { ViewStyle } from "react-native";
import styled from "@emotion/native";


/**
 * Just an alias for [View], but more explicitly named for semantic purposes.
 * Use this when you want to create a row layout.
 */
export const Row = React.memo(styled.View({
  flexDirection: "row"
}));

/**
 * A row that is aware of spatial navigation.
 */
export const SpatialRow = React.memo(
  ({ children, style }: { style?: ViewStyle; children: React.ReactNode }) =>
    <SpatialNavigationView direction={"horizontal"} style={style} children={children} />
);
