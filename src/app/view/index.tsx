import { observer } from "mobx-react-lite";
import { Typography } from "@/components/Typography";
import { useLocalSearchParams } from "expo-router";

/**
 * A "View All" screen for either media lists/collections, or Sections.
 * Pass query params [mediaContainerId] or [sectionId] to determine which type of media grid to display.
 */
const MediaGrid = observer(({}) => {
  const { mediaContainerId, sectionId } = useLocalSearchParams<{ mediaContainerId?: string, sectionId?: string }>();

  return (<>
    <Typography>to be impl {mediaContainerId} / {sectionId}</Typography>
  </>);
});

export default MediaGrid;