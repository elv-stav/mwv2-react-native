import { useLocalSearchParams } from "expo-router";
import { PermissionContext } from "@/data/helpers/PermissionContext";

/**
 * Custom hook to retrieve the PermissionContext from the URL query parameters.
 * It deserializes the 'pctx' parameter into a PermissionContext object.
 *
 * @returns {PermissionContext} The deserialized PermissionContext.
 */
const usePermissionContextQuery = (): PermissionContext => {
  const { pctx } = useLocalSearchParams<{ pctx: string }>();
  return PermissionContext.deserialize(pctx);
};

export default usePermissionContextQuery;
