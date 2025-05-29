import { EffectCallback, useFocusEffect } from "expo-router";
import { DependencyList, useCallback } from "react";

/**
 * [useFocusEffect] requires wrapping the callback in `useCallback` to avoid running the effect too often.
 * This hook simplifies that by automatically wrapping the callback in `useCallback` with the provided dependencies.
 */
const useFocusEffectMemo = (callback: EffectCallback, deps: DependencyList) => {
  useFocusEffect(useCallback(callback, deps));
};

export default useFocusEffectMemo;
