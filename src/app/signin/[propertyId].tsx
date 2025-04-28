import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { action, runInAction } from "mobx";
import { mediaPropertyStore, rootStore, tokenStore } from "@/data/stores";
import { ActivityIndicator, ImageBackground, StyleSheet } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Typography } from "@/components/Typography";
import QRCode from "react-qr-code";
import { theme } from "@/design-system/theme/theme";
import TvButton from "@/components/TvButton";
import Loader from "@/components/Loader";
import { Page } from "@/components/Page";
import { DefaultFocus, SpatialNavigationView } from "react-tv-space-navigation";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";

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

  return <Page>
    <ImageBackground
      source={property?.loginBackgroundImage?.urlSource()}
      style={styles.container}>
      <Typography   {...{/*className="sign-in-page__title"*/ }}>Sign In</Typography>
      {activationData ? <QrAndCode url={url} code={activationData.id} /> :
        <Loader /*className={"sign-in-page__qr-loader"}*/ />}
      <SpatialNavigationView direction={"horizontal"} style={styles.buttonContainer}>
        <DefaultFocus>
          <TvButton onSelect={action(() => tokenStore.refreshActivationData())} title={"Request New Code"} />
        </DefaultFocus>
        <TvButton onSelect={() => router.back()} title={"Back"} />
      </SpatialNavigationView>
    </ImageBackground>
  </Page>;
});

const QrAndCode = observer(({ url, code }: { url?: string, code: string }) => {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  useEffect(() => {
    (async function () {
        if (url) {
          setShortUrl(await rootStore.CreateShortURL(url));
        }
      }
    )();
  }, [url]);
  if (!shortUrl) {
    return <ActivityIndicator size={"large"} />;
  }
  return <>
    <Typography style={styles.activationText}>{code}</Typography>
    <Link href={shortUrl} target="_blank">
      <QRCode value={shortUrl} style={styles.qrCode} />
    </Link>
  </>;
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: scaledPixels(75),
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: scaledPixels(20),

  },
  activationText: {
    marginBottom: 12,
  },
  qrCode: {
    backgroundColor: theme.colors.primary.contrastText,
    width: 200,
    height: 200,
    marginBottom: 32,
    padding: 12,
  }
});

export default SignIn;
