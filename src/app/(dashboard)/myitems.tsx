import { observer } from "mobx-react-lite";
import {
  SpatialNavigationNode,
  SpatialNavigationScrollView,
  SpatialNavigationVirtualizedGrid
} from "react-tv-space-navigation";
import { theme } from "@/design-system/theme/theme";
import { useCallback, useEffect, useState } from "react";
import { NftModel } from "@/data/models/nft/NftModel";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { DebugToast } from "@/utils/Toasts";
import { nftStore } from "@/data/stores";
import TvInputText from "@/components/TvInputText";
import { debounce } from "@react-navigation/native-stack/src/utils/debounce";
import NftCard from "@/components/cards/NftCard";

const HORIZONTAL_PADDING = scaledPixels(260);
const GRID_GAP = scaledPixels(30);
const GRID_COLUMNS = 3;

const MyItems = observer(({}) => {
  const [nfts, setNfts] = useState<NftModel[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    nftStore.Search(query)
      .then(setNfts)
      .catch((error) => {
        setNfts([]);
        DebugToast.show(`Error loading items: ${error}`);
      });
  }, [query]);

  const availableSpace = (scaledPixels(1920) - (HORIZONTAL_PADDING * 2) - (GRID_GAP * (GRID_COLUMNS - 1)));
  const cardWidth = availableSpace / GRID_COLUMNS;
  const cardHeight = cardWidth / 0.65;

  const renderItem = useCallback(({ item }: { item: NftModel }) => {
    return <NftCard nft={item} width={cardWidth} height={cardHeight} />;
  }, []);

  return (<SpatialNavigationNode>
    <SpatialNavigationScrollView style={{
      width: "100%",
      height: "100%",
      backgroundColor: theme.colors.background.main,
      paddingHorizontal: HORIZONTAL_PADDING,
      paddingVertical: scaledPixels(60),
    }}>
      <TvInputText
        icon="search"
        textStyle={{ fontSize: scaledPixels(48) }}
        onChangeText={debounce(setQuery, 1000)}
        style={{ width: "100%", marginBottom: scaledPixels(60) }}
        placeholder={`Search My Items`}
      />
      <SpatialNavigationVirtualizedGrid
        data={nfts}
        style={{ width: "100%", height: "100%" }}
        rowContainerStyle={{ gap: GRID_GAP }}
        renderItem={renderItem}
        itemHeight={cardHeight + GRID_GAP}
        numberOfColumns={GRID_COLUMNS}
      />
    </SpatialNavigationScrollView>
  </SpatialNavigationNode>);
});

export default MyItems;
