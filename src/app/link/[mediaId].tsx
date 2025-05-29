import { observer } from "mobx-react-lite";
import { Page } from "@/components/Page";
import { Typography } from "@/components/Typography";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mediaPropertyStore, rootStore, tokenStore } from "@/data/stores";
import QRCode from "react-qr-code";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { DefaultFocus } from "react-tv-space-navigation";
import TvButton from "@/components/TvButton";
import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

const ExternalLink = observer(({}) => {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  // TODO: This only works if the media object was already cached before reaching this page.
  const media = mediaPropertyStore.mediaItems[mediaId];

  const token = tokenStore.fabricToken;
  // TODO: figure out if we still need to poke at media_link in addition to media_file
  const mediaLocation = media?.media_file?.url();

  const router = useRouter();
  const [linkUrl, setLinkUrl] = useState("");
  useEffect(() => {
    if (!mediaLocation) {
      return;
    }

    const tokenQuery = token ? `?authorization=${token}` : "";
    rootStore.CreateShortURL(`${mediaLocation}${tokenQuery}`)
      .then(url => setLinkUrl(url || ""));
  }, [mediaLocation, token]);

  return (<Page name={"external-link"}>
    <View style={styles.container}>
      <Typography style={styles.title}>Point your camera to the QR Code below for content</Typography>
      <Typography fontSize={scaledPixels(48)}>Or visit: {linkUrl}</Typography>
      <QRCode value={linkUrl} size={scaledPixels(500)} style={styles.qrCode} />
      <DefaultFocus>
        <TvButton title={"Back"} onSelect={router.back} />
      </DefaultFocus>
    </View>
  </Page>);
});

const styles = StyleSheet.create({
  container: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    gap: scaledPixels(60)
  },
  title: {
    textAlign: "center",
    lineHeight: scaledPixels(74),
    fontSize: scaledPixels(62),
    fontFamily: "Inter_600SemiBold"
  } as const,
  qrCode: {
    padding: scaledPixels(18),
    backgroundColor: "white",
    zIndex: 999
  }
});

export default ExternalLink;
