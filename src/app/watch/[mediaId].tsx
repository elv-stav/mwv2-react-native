import { observer } from "mobx-react-lite";
import { useLocalSearchParams } from "expo-router";
import { Typography } from "@/components/Typography";

const VideoPlayer = observer(({}) => {
  const { mediaId } = useLocalSearchParams();
  return (<>
    <Typography>VideoPlayer for {mediaId}</Typography>
  </>);
});

export default VideoPlayer;
