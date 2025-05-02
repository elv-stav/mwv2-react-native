import { observer } from "mobx-react-lite";
import { Page } from "@/components/Page";
import { Typography } from "@/components/Typography";
import { useLocalSearchParams } from "expo-router";

const SearchPage = observer(({}) => {
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  return (<Page>
    <Typography>Search page for {propertyId}. to be impl..</Typography>
  </Page>);
});

export default SearchPage;
