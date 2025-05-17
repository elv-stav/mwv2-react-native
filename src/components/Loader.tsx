import { ActivityIndicator } from "react-native";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { ActivityIndicatorProps } from "react-native/Libraries/Components/ActivityIndicator/ActivityIndicator";

const Loader = ({ size = scaledPixels(100), ...rest }: ActivityIndicatorProps) => {
  return <ActivityIndicator size={size} color={"white"} {...rest} />;
};

export default Loader;