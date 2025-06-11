import { observer } from "mobx-react-lite";
import { Typography } from "@/components/Typography";
import usePermissionContextQuery from "@/hooks/usePermissionContextQuery";
import { Page } from "@/components/Page";
import { rootStore, tokenStore } from "@/data/stores";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import { action, runInAction } from "mobx";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { ImageBackground } from "expo-image";
import TvButton from "@/components/TvButton";
import { DefaultFocus } from "react-tv-space-navigation";
import { useRouter } from "expo-router";
import QRCode from "react-qr-code";
import { StyleSheet } from "react-native";
import { PermissionContext, ResolvedPermissionContext } from "@/data/helpers/PermissionContext";
import { Dict } from "@/utils/Dict";
import Env from "@/data/Env";
import { Utils } from "@eluvio/elv-client-js";
import { MediaPageModel } from "@/data/models/MediaPageModel";
import { ResolvedPermissions } from "@/data/models/PermissionSettings";
import { useEffect, useState } from "react";

const PurchasePrompt = observer(({}) => {
  const router = useRouter();
  const context = usePermissionContextQuery();
  const resolvedContext = PermissionContext.resolve(context);
  const { property, page } = resolvedContext;

  const bgImage = GetBgImage(property, page);
  const permissions: ResolvedPermissions = GetPermissions(resolvedContext);

  const [purchaseUrl, setPurchaseUrl] = useState("");
  useEffect(() => {
    runInAction(() => buildPurchaseUrl(context, permissions))
      .then(url => setPurchaseUrl(url || ""));
  }, [context, permissions]);

  return (<Page name={"PurchasePrompt"}>
    <ImageBackground source={bgImage} style={styles.container}>
      <Typography fontSize={scaledPixels(62)} fontFamily={"Inter_600SemiBold"}>
        Sign In On Browser to Purchase
      </Typography>
      <Typography fontSize={scaledPixels(52)} fontFamily={"Inter_500Medium"}>{purchaseUrl}</Typography>
      <QRCode value={purchaseUrl} size={scaledPixels(500)} style={styles.qrCode} />
      <DefaultFocus>
        <TvButton title={"Back"} onSelect={router.back} />
      </DefaultFocus>
    </ImageBackground>
  </Page>);
});

const GetBgImage = action((property?: MediaPropertyModel, page?: MediaPageModel) => {
  // Prefer property login image, then page background image.
  return (property?.login?.styling?.background_image_tv ||
    property?.login?.styling?.background_image_desktop ||
    (page || property?.main_page)?.layout?.background_image)
    ?.urlSource(scaledPixels(1080));
});

const GetPermissions = action((resolvedContext: ResolvedPermissionContext): ResolvedPermissions =>
  resolvedContext.mediaItem?.permissions?._content ||
  resolvedContext.sectionItem?.permissions?._content ||
  resolvedContext.section?.permissions?._content ||
  resolvedContext.page?.permissions?._page ||
  resolvedContext.property.permissions?._property ||
  { authorized: false });

const buildPurchaseUrl = async (permissionContext: PermissionContext, permissions: ResolvedPermissions) => {
  const context: Dict<any> = {
    "type": "purchase"
  };

  // Start from the most broad id and keep overriding with more specific ids.
  // Any field that is [null] will not override the previous value.
  context.id = permissionContext.propertyId;
  context.id = permissionContext.pageId;
  context.id = permissionContext.sectionId;
  context.id = permissionContext.sectionItemId;
  context.id = permissionContext.mediaItemId;

  // Everything else we have explicitly specified.
  context.sectionSlugOrId = permissionContext.sectionId;
  context.sectionItemId = permissionContext.sectionItemId;
  const permissionItemIds = (permissions?.permission_item_ids || []).filter((x) => x);
  if (permissionItemIds.length > 0) {
    context.permissionItemIds = permissionItemIds;
  }
  context.secondaryPurchaseOption = permissions?.secondary_market_purchase_option;

  const auth = {
    clusterToken: tokenStore.clusterToken,
    address: tokenStore.walletAddress,
    email: tokenStore.userEmail,
  };

  const url = new URL(Env.walletUrl);
  url.pathname += permissionContext.propertyId + "/";
  url.pathname += permissionContext.pageId;
  if (context) {
    url.searchParams.append("p", Utils.B58(JSON.stringify(context)));
  }
  url.searchParams.append("authorization", Utils.B58(JSON.stringify(auth)));
  return rootStore.CreateShortURL(url.toString());
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: scaledPixels(60)
  },
  qrCode: {
    padding: scaledPixels(18),
    backgroundColor: "white",
    zIndex: 999
  }
});

export default PurchasePrompt;
