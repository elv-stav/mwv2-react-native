import { observer } from "mobx-react-lite";
import { Image, View } from "react-native";
import { SectionComponentProps } from "@/components/sections/SectionComponentProps";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { useEffect, useState } from "react";
import Utils from "@/utils/elv-client-utils";
import { Typography } from "@/components/Typography";

const HeroSection = observer(({ section }: SectionComponentProps) => {
  return (<>
    {section.hero_items?.map(item => {
      const display = item.display;

      const logoHeight = scaledPixels(180);
      const [logoWidth, setLogoWidth] = useState<number | undefined>();
      const logo = Utils.ResizeImage({ imageUrl: display?.logo?.url(), height: logoHeight });
      useEffect(() => {
        logo && Image.getSize(logo, (width) => {
          setLogoWidth(width);
        });
      }, []);

      return <View key={item.id}>
        {logo &&
          <Image source={{ uri: logo }} resizeMode={"contain"} style={{
            height: logoHeight,
            width: logoWidth,
          }} />}
        {display?.title && <Typography>{display.title}</Typography>}
        {display?.description && <Typography>{display.description}</Typography>}
      </View>;
    })}
  </>);
});

export default HeroSection;
