import { observer } from "mobx-react-lite";
import { useLocalSearchParams } from "expo-router";
import Video from "@/components/Video";
import { mediaPropertyStore } from "@/data/stores";
import { Page } from "@/components/Page";
import { Utils } from "@eluvio/elv-client-js";

const VideoPlayer = observer(({}) => {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();

  const hash = mediaPropertyStore.mediaItems[mediaId]?.versionHash;
  const objectId = !!hash && Utils.DecodeVersionHash(hash)?.objectId;
  return (<Page name={"video-player"}>
    {/*@ts-ignore*/}
    {!!objectId && <Video objectId={objectId} />}
  </Page>);
});

export default VideoPlayer;
