import { observer } from "mobx-react-lite";
import { Page } from "@/components/Page";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import SectionsList from "@/components/sections/SectionsList";
import { MediaSectionModel } from "@/data/models/MediaSectionModel";
import { mediaPropertyStore } from "@/data/stores";
import { runInAction } from "mobx";
import { DefaultFocus, SpatialNavigationScrollView } from "react-tv-space-navigation";
import TvInputText from "@/components/TvInputText";
import { debounce } from "@react-navigation/native-stack/src/utils/debounce";
import { StyleSheet } from "react-native";

const SearchPage = observer(({}) => {
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const [query, setQuery] = useState("");
  const property = mediaPropertyStore.observeProperty(propertyId);
  const title = property?.title || property?.name || "";
  const [sections, setSections] = useState<MediaSectionModel[]>([]);
  useEffect(() => {
    if (!property) {
      return;
    }
    runInAction(() => mediaPropertyStore.Search(property, query))
      .then(setSections);
  }, [query]);

  return (<Page name={"search"}>
    <SpatialNavigationScrollView>
      <DefaultFocus>
        <TvInputText
          style={styles.searchBox}
          placeholder={`Search ${title}`}
          onChangeText={debounce(setQuery, 1000)}
        />
      </DefaultFocus>
      <SectionsList sections={sections} permissionContext={{ propertyId }} />
    </SpatialNavigationScrollView>
  </Page>);
});

const styles = StyleSheet.create({
  searchBox: {
    width: "100%",
  },
});

export default SearchPage;
