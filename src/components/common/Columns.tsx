import React from "react";
import { SpatialNavigationView } from "react-tv-space-navigation";
import { ViewStyle } from "react-native";
import styled from "@emotion/native";

/**
 * Just an alias for [View], but more explicitly named for semantic purposes.
 * Use this when you want to create a row layout.
 */
export const Column = React.memo(styled.View());

/**
 * A column that is aware of spatial navigation.
 */
export const SpatialColumn = React.memo(
  ({ children, style }: { style?: ViewStyle; children: React.ReactNode }) =>
    <SpatialNavigationView direction={"vertical"} style={style} children={children} />
);
