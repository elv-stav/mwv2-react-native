import { observer } from "mobx-react-lite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mediaPropertyStore, nftStore } from "@/data/stores";
import { Page } from "@/components/Page";
import NftCard from "@/components/cards/NftCard";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import TvButton from "@/components/TvButton";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useTheme } from "@emotion/react";
import { SpatialRow } from "@/components/common/Rows";
import { Column, SpatialColumn } from "@/components/common/Columns";
import { NftModel } from "@/data/models/nft/NftModel";
import { Typography } from "@/components/Typography";
import { SpatialNavigationFocusableView } from "react-tv-space-navigation";
import { NftApi } from "@/data/api/NftApi";
import { NftInfoModel } from "@/data/models/nft/NftInfo";
import { DebugToast } from "@/utils/Toasts";

const CARD_WIDTH = scaledPixels(420);
// This is duplicated logic from myitems.tsx, so potentially can break;
const CARD_HEIGHT = CARD_WIDTH / 0.65;

const NftDetails = observer(({}) => {
  const { uid } = useLocalSearchParams<{ uid: string }>();
  // Assume nft is already cached in the store and doesn't need to be fetched.
  const nft = nftStore.NftByUid(uid);
  const router = useRouter();
  const theme = useTheme();

  const propertyId = nft?.nft_template?.bundled_property_id;
  useEffect(() => {
    if (propertyId) {
      // Fetch the property in the background just in case it's not cached, so it's ready when the user navigates to it.
      mediaPropertyStore.fetchProperty(propertyId).finally();
    }
  }, [propertyId]);

  if (!nft) {
    return null;
  }

  return (<Page name={"nft-details"}>
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: theme.colors.background.main }}>
      <SpatialRow style={{
        width: "70%",
        height: "70%",
        alignSelf: "center",
        gap: scaledPixels(90),
      }}>
        <SpatialColumn
          style={{
            gap: scaledPixels(30),
            justifyContent: "center",
            alignItems: "center",
          }}>
          <NftCard nft={nft} width={CARD_WIDTH} height={CARD_HEIGHT} focusable={false} />
          {!!propertyId &&
            <TvButton title={"Go to Property"} onSelect={() => router.navigate(`/properties/${propertyId}`)} />}
        </SpatialColumn>
        <Metadata nft={nft} />
      </SpatialRow>
    </View>
  </Page>);
});

const TABS = [
  {
    title: "Description",
    content: (nft?: NftModel) => <DescriptionTab nft={nft} />
  },
  {
    title: "Mint Info",
    content: (nft?: NftModel) => <MintInfoTab nft={nft} />
  },
  {
    title: "Contract & Version",
    content: (nft?: NftModel) => <ContractAndVersionTab nft={nft} />
  }
];

const Metadata = observer(({ nft }: { nft?: NftModel }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const content: (nft?: NftModel) => ReactNode = useCallback(
    () => TABS[selectedIndex].content(nft),
    [selectedIndex, nft]
  );
  return <SpatialColumn style={{ flex: 1, gap: scaledPixels(30) }}>
    <SpatialRow style={{ gap: scaledPixels(60) }}>
      {
        TABS.map(
          (item, i) => (
            <MetadataTitle
              key={item.title}
              title={item.title}
              isSelected={selectedIndex === i}
              onSelect={() => setSelectedIndex(i)}
            />
          ))
      }
    </SpatialRow>
    {content(nft)}
  </SpatialColumn>;
});

const MetadataTitle = ({ title, isSelected, onSelect }: {
  title: string,
  isSelected: boolean,
  onSelect: () => void
}) => {
  return <SpatialNavigationFocusableView onSelect={onSelect} onFocus={onSelect}>
    {({ isFocused }) => {
      const color = isFocused ? "white" : "#7B7B7B";
      return <Typography style={{
        fontSize: scaledPixels(32),
        color: color,
        borderBottomColor: color,
        borderBottomWidth: isSelected ? scaledPixels(2) : 0,
      }}>
        {title}
      </Typography>;
    }}
  </SpatialNavigationFocusableView>;
};

const DescriptionTab = observer(({ nft }: { nft?: NftModel }) => {
  if (!nft) return null;
  let subtitle = "";
  if (nft.nft_template?.edition_name) {
    subtitle += `${nft.nft_template?.edition_name}    `;
  }
  subtitle += `#${nft.token_id}`;
  return <Column>
    <Typography fontSize={scaledPixels(48)}>{nft.nft_template?.display_name}</Typography>
    <Typography
      style={{
        color: "#7A7A7A",
        fontFamily: "Inter_500Medium",
        paddingVertical: scaledPixels(16),
      }}>{subtitle}</Typography>
    <Typography>{nft.nft_template?.description}</Typography>
  </Column>;
});

const MintInfoTab = observer(({ nft }: { nft?: NftModel }) => {
  const [nftInfo, setNftInfo] = useState<NftInfoModel | null>(null);
  const contractAddress = nft?.contract_addr;
  useEffect(() => {
    if (contractAddress) {
      NftApi.getNftInfo(contractAddress).then(setNftInfo);
    }
  }, [contractAddress]);
  const max = nftInfo && (nftInfo.cap - nftInfo.burned) || undefined;
  return <Column>
    <LabeledInfo label={"Edition"} info={nft?.nft_template?.edition_name} />
    <LabeledInfo label={"Number Minted"} info={nftInfo?.minted} />
    <LabeledInfo label={"Number in Circulation"} info={nftInfo?.total_supply} />
    <LabeledInfo label={"Number Burned"} info={nftInfo?.burned} />
    <LabeledInfo label={"Maximum Possible in Circulation"} info={max} />
    <LabeledInfo label={"Cap"} info={nftInfo?.cap} />
  </Column>;
});

const LabeledInfo = ({ label, info, maxLines }: { label: string, info?: (string | number), maxLines?: number }) => {
  return <>
    <Typography style={{
      fontSize: scaledPixels(32),
      color: "#9B9B9B",
      paddingBottom: scaledPixels(10),
    }}>{label}</Typography>
    <Typography style={{
      fontSize: scaledPixels(24),
      paddingBottom: scaledPixels(30),
    }}
                numberOfLines={maxLines}
    >{info}</Typography>
  </>;
};

const ContractAndVersionTab = observer(({ nft }: { nft?: NftModel }) => {
  const hash = nft?.token_uri?.split("/")?.find(it => it.startsWith("hq__"));
  const lookoutUrl = !!nft?.contract_addr && `https://explorer.contentfabric.io/address/${nft?.contract_addr}/transactions`;
  return <SpatialColumn>
    <LabeledInfo label={"Contract Address"} info={nft?.contract_addr} />
    <LabeledInfo label={"Hash"} info={hash} maxLines={1} />
    <View style={{ height: scaledPixels(40) }} />
    {!!lookoutUrl && <TvButton title={"See more info on the Eluvio Lookout"} onSelect={() => {
      DebugToast.show("to be implemented");
    }} />}
  </SpatialColumn>;
});

export default NftDetails;
