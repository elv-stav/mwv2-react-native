import { observer } from "mobx-react-lite";
import { Typography } from "@/components/Typography";
import { useLocalSearchParams } from "expo-router";
import { mediaPropertyStore } from "@/data/stores";

const SignIn = observer(({}) => {
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const property = mediaPropertyStore.observeProperty(propertyId);
  return (<>
    <Typography>le sign in {property?.displayName}</Typography>
  </>);
});

export default SignIn;
