import { observer } from "mobx-react-lite";
import { Page } from "@/components/Page";
import { mediaPropertyStore } from "@/data/stores";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { ImageBackground, View } from "react-native";
import styled from "@emotion/native";
import { Typography } from "@/components/Typography";
import { PermissionContext } from "@/data/helpers/PermissionContext";
import { useEffect, useMemo, useState } from "react";
import { LiveVideoUtil } from "@/data/helpers/LiveVideoUtil";

const Countdown = observer(({}) => {
  const { mediaId, pctx } = useLocalSearchParams<{ mediaId: string, pctx: string }>();
  const context = PermissionContext.deserialize(pctx);

  const property = mediaPropertyStore.observeProperty(context.propertyId);
  const bgImage = useMemo(
    () => property?.image_tv?.urlSource(scaledPixels(1080)),
    [property]
  );


  // TODO: This only works if the media object was already cached before reaching this page.
  const media = mediaPropertyStore.mediaItems[mediaId];

  const [remainingTime, setRemainingTime] = useState("");
  useEffect(() => {
    function updateCountdown() {
      const time = LiveVideoUtil.remainingTimeString(media);
      setRemainingTime(time);
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [media?.start_time]);

  const icons = media.icons?.map(icon => {
    const size = scaledPixels(200);
    const src = icon.icon?.urlSource(size);
    if (!src) {
      return null;
    }
    return <Image key={icon.icon?.path} source={src} style={{ height: size, width: size }} contentFit={"contain"} />;
  });
  const headers = media.headers?.join("\u00A0\u00A0\u00A0\u00A0");

  return <Page>
    <ImageBackground
      source={bgImage}
      style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
      {icons && <IconContainer>{icons}</IconContainer>}
      {headers && <Headers>{headers}</Headers>}
      <Title>{media.title}</Title>
      <CountdownText>{remainingTime}</CountdownText>
    </ImageBackground>
  </Page>;
});

const IconContainer = styled(View)({
  flexDirection: 'row',
  gap: scaledPixels(60),
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: scaledPixels(60),
});

const Headers = styled(Typography)({
  fontFamily: "Inter_500Medium",
  fontSize: scaledPixels(32),
  color: "#A5A6A8",
  backgroundColor: "#000000CC",
  borderRadius: 999,
  paddingVertical: scaledPixels(16),
  paddingHorizontal: scaledPixels(44),
});

const Title = styled(Typography)({
  fontFamily: "Inter_700Bold",
  fontSize: scaledPixels(32),
  margin: scaledPixels(60),
});

const CountdownText = styled(Typography)({
  fontFamily: "Inter_700Bold",
  fontSize: scaledPixels(62),
  margin: scaledPixels(10),
});

export default Countdown;
