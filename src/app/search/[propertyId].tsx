import { observer } from "mobx-react-lite";
import { Page } from "@/components/Page";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import SectionsList from "@/components/sections/SectionsList";
import { MediaSectionModel } from "@/data/models/MediaSectionModel";
import { mediaPropertyStore } from "@/data/stores";
import { runInAction } from "mobx";
import { SpatialNavigationScrollView } from "react-tv-space-navigation";
import TvInputText from "@/components/TvInputText";
import { debounce } from "@react-navigation/native-stack/src/utils/debounce";
import { ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";

const SearchPage = observer(({}) => {
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const [query, setQuery] = useState("");
  const property = mediaPropertyStore.observeProperty(propertyId);
  const title = property?.displayName || "";
  const [sections, setSections] = useState<MediaSectionModel[]>([]);
  useEffect(() => {
    if (!property) {
      return;
    }
    runInAction(() => mediaPropertyStore.Search(property, query))
      .then(setSections);
  }, [query, property]);
  const logo = (property?.tv_header_logo || property?.header_logo)?.urlSource();
  const pageRef = useRef<ScrollView>(null);

  return (<Page name={"search"}>
    <SpatialNavigationScrollView ref={pageRef} offsetFromStart={scaledPixels(160)}>
      <View style={styles.headerRow}>
        <Image source={logo} style={styles.logo} contentFit={"contain"} />
        <TvInputText
          icon="search"
          style={styles.searchBox}
          textStyle={{ fontSize: scaledPixels(48) }}
          placeholder={`Search ${title}`}
          onChangeText={debounce(setQuery, 1000)}
        />
      </View>
      <SectionsList sections={sections} childKeyNonce={query} permissionContext={{ propertyId }} />
    </SpatialNavigationScrollView>
  </Page>);
});

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: scaledPixels(78),
    paddingVertical: scaledPixels(48),
  },
  logo: {
    width: scaledPixels(160),
    height: scaledPixels(96),
  },
  searchBox: {
    flex: 1,
    marginLeft: scaledPixels(16),
  },
});

export default SearchPage;
