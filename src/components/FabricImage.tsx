import { observer } from "mobx-react-lite";
import { AssetLinkModel } from "@/data/models/AssetLinkModel";
import React, { useMemo, useState } from "react";
import { Image } from "expo-image";
import { ImageProps } from "expo-image/src/Image.types";

type Props = Omit<ImageProps, "source"> & {
  imageLink?: AssetLinkModel;
}

/**
 * Displays an image from an AssetLinkModel and scales it based on the height of the image container.
 */
const FabricImage = observer(({ imageLink, ...rest }: Props) => {
  const [imageHeight, setImageHeight] = useState(0);
  const scaledImage = useMemo((() => {
    return imageLink?.urlSource(imageHeight);
  }), [imageLink, imageHeight]);
  return <Image
    source={scaledImage}
    onLayout={(event) => setImageHeight(event.nativeEvent.layout.height)}
    {...rest}
  />;
});

export default FabricImage;
