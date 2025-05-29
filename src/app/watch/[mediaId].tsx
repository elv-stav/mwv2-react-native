import { observer } from "mobx-react-lite";
import { useLocalSearchParams } from "expo-router";
import Video from "@/components/Video";
import { mediaPropertyStore } from "@/data/stores";
import { Page } from "@/components/Page";

const VideoPlayer = observer(({}) => {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  const hash = mediaPropertyStore.mediaItems[mediaId]?.versionHash;
  return (<Page name={"video-player"}>
    {/*@ts-ignore*/}
    <Video videoHash={hash} />
  </Page>);
});

export default VideoPlayer;
