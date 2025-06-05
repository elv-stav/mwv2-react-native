import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { action, runInAction } from "mobx";
import { mediaPropertyStore, rootStore, tokenStore } from "@/data/stores";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Typography } from "@/components/Typography";
import QRCode from "react-qr-code";
import TvButton from "@/components/TvButton";
import Loader from "@/components/Loader";
import { Page } from "@/components/Page";
import { DefaultFocus, SpatialNavigationView } from "react-tv-space-navigation";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import styled from "@emotion/native";

const SignIn = observer(() => {
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const property = mediaPropertyStore.observeProperty(propertyId);

  const [signInComplete, setSignInComplete] = useState(() => tokenStore.isLoggedIn);
  const activationData = tokenStore.activationData;

  useEffect(action(() => {
    tokenStore.refreshActivationData().finally();
  }), []);

  useEffect(action(() => {
    let interval: any;
    if (activationData?.id && activationData.passcode) {
      interval = setInterval(action(async () => {
        if (await tokenStore.checkToken(activationData)) {
          clearInterval(interval);
          interval = undefined;
          // Sign-in successful.
          // Re-fetch Properties so they are up-to-date with the new token and corresponding permissions
          await runInAction(async () => {
            // I don't know why, but without wrapping this in `runInAction`,
            // mobx will complain about missing a reactive context.
            // Even though we are already inside an `action()` wrapper.
            await mediaPropertyStore.fetchProperties();
          });
          setSignInComplete(true);
        }
      }), 5000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }), [activationData?.id, activationData?.passcode]);

  let url;
  if (activationData?.url) {
    const oauthUrl = new URL(activationData?.url);
    oauthUrl.searchParams.set("provider", "ory");
    oauthUrl.searchParams.set("pid", propertyId);
    url = oauthUrl.toString();
  }
  const router = useRouter();
  useEffect(() => {
    if (signInComplete) {
      router.replace(`/properties/${propertyId}`);
    }
  }, [signInComplete]);

  return <Page name={"sign-in"}>
    <ImageBackground
      source={property?.loginBackgroundImage?.urlSource()}
      style={styles.container}>
      <Title>Sign In</Title>
      <QrAndCode url={url} code={activationData?.id} />
      <SpatialNavigationView direction={"horizontal"} style={styles.buttonContainer}>
        <DefaultFocus>
          <TvButton onSelect={action(() => tokenStore.refreshActivationData())} title={"Request New Code"} />
        </DefaultFocus>
        <TvButton onSelect={() => router.back()} title={"Back"} />
      </SpatialNavigationView>
    </ImageBackground>
  </Page>;
});

const QrAndCode = observer(({ url, code }: { url?: string, code?: string }) => {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  useEffect(() => {
    if (url) {
      rootStore.CreateShortURL(url)
        .then(shortUrl => setShortUrl(shortUrl));
    }
  }, [url]);
  const size = scaledPixels(360);
  const padding = styles.qrCode.padding;
  let content;
  if (!code || !shortUrl) {
    content = <Loader style={{ width: "100%", height: "100%" }} />;
  } else {
    content = <QRCode value={shortUrl} style={styles.qrCode} size={size - (padding * 2)} />;
  }
  return (<View style={{ gap: scaledPixels(20) }}>
    <Title>{code || " "}</Title>
    {/* @ts-ignore this href is going outside the app, so the href isn't recognized*/}
    <Link href={shortUrl || ""} target="_blank" style={{ width: size, height: size }}>
      {content}
    </Link>
  </View>);
});

const Title = styled(Typography)({
  textAlign: "center",
  fontSize: scaledPixels(62),
  fontFamily: "Inter_700Bold",
  marginBottom: scaledPixels(32),
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: scaledPixels(75),
    alignItems: "center",
    justifyContent: "center",
    gap: scaledPixels(40)
  },
  buttonContainer: {
    flexDirection: "row",
    gap: scaledPixels(30),
  },
  qrCode: {
    backgroundColor: "white",
    padding: scaledPixels(18),
  }
});

export default SignIn;
