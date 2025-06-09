import { observer } from "mobx-react-lite";
import { useLocalSearchParams } from "expo-router";
import { Typography } from "@/components/Typography";
import { nftStore } from "@/data/stores";
import { Page } from "@/components/Page";

const NftDetails = observer(({}) => {
  const { uid } = useLocalSearchParams<{ uid: string }>();
  // Assume nft is already cached in the store and doesn't need to be fetched.
  const nft = nftStore.NftByUid(uid);

  return (<Page name={"nft-details"}>
    <Typography>NFT details for {nft?._name} ({uid})</Typography>
  </Page>);
});

export default NftDetails;
