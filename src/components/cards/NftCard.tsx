import { NftModel } from "@/data/models/nft/NftModel";
import { useRouter } from "expo-router";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import nftBgFocused from "@/assets/nft_card_focused_bg.png";
import nftBg from "@/assets/nft_card_bg.png";
import { Image, ImageBackground } from "expo-image";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import styled from "@emotion/native/dist/emotion-native.cjs";
import { Typography } from "@/components/Typography";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Utils } from "@eluvio/elv-client-js";

type Props = {
  nft: NftModel,
  width: number,
  height: number,
  focusable?: boolean,
}

const NftCard = observer(({ nft, width, height, focusable = true }: Props) => {
  const router = useRouter();
  if (focusable) {
    return <SpatialNavigationFocusableView
      onSelect={() => router.navigate(`/nft/${nft._uid}`)}>
      {({ isFocused }) =>
        <CardContent isFocused={isFocused} nft={nft} width={width} height={height} />
      }
    </SpatialNavigationFocusableView>;
  } else {
    return <CardContent isFocused={false} nft={nft} width={width} height={height} />;
  }
});

/**
 * The UI of the card. Doesn't handle focusability.
 */
const CardContent = observer(({ nft, isFocused, width, height }: {
  nft: NftModel,
  isFocused: boolean,
  width: number,
  height: number
}) => {
  const bg = isFocused ? nftBgFocused : nftBg;

  const scaledImage = useMemo(() => {
    // noinspection JSSuspiciousNameCombination: Yes, I'm using width as height. sue me.
    return Utils.ResizeImage({ imageUrl: nft.meta.image, height: width });
  }, [nft.meta.image, width]);

  return <ImageBackground source={bg}
                          contentFit={"fill"}
                          style={{
                            width,
                            height,
                            alignItems: "center",
                            paddingVertical: scaledPixels(40),
                            paddingHorizontal: scaledPixels(20),
                          }}>
    <TokenLabel isFocused={isFocused}>#{nft.token_id}</TokenLabel>
    <NftImage source={scaledImage} />
    <NftTitle isFocused={isFocused} numberOfLines={1}>{nft._name}</NftTitle>
    <NftEdition isFocused={isFocused} numberOfLines={1}>{nft.nft_template?.edition_name}</NftEdition>
  </ImageBackground>;
});

const TokenLabel = styled(Typography)<{ isFocused: boolean }>(({ isFocused }) => ({
  alignSelf: "flex-end",
  color: isFocused ? "black" : "#7A7A7A",
  fontFamily: "Inter_500Medium",
  paddingBottom: scaledPixels(28)
}));

const NftImage = styled(Image)(() => ({
  width: "100%",
  aspectRatio: 1,
  shadowRadius: scaledPixels(8),
}));

const NftTitle = styled(Typography)<{ isFocused: boolean }>(({ isFocused }) => ({
  fontSize: scaledPixels(36),
  color: isFocused ? "black" : "white",
  paddingTop: scaledPixels(36),
}));

const NftEdition = styled(Typography)<{ isFocused: boolean }>(({ isFocused }) => ({
  color: isFocused ? "#646464" : "#7A7A7A",
  fontFamily: "Inter_500Medium",
  paddingTop: scaledPixels(10),
}));

export default NftCard;
