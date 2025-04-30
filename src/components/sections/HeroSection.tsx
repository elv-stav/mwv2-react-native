import { observer } from "mobx-react-lite";
import { Image, View } from "react-native";
import { SectionComponentProps } from "@/components/sections/SectionComponentProps";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { useEffect, useState } from "react";
import { Typography } from "@/components/Typography";

const HeroSection = observer(({ section }: SectionComponentProps) => {
  return (<>
    {section.hero_items?.map(item => {
      const display = item.display;

      const logoHeight = scaledPixels(180);
      const [logoWidth, setLogoWidth] = useState<number | undefined>();
      const logo = display?.logo?.urlSource(logoHeight);
      useEffect(() => {
        logo?.uri && Image.getSize(logo.uri, (width) => {
          setLogoWidth(width);
        });
      }, []);

      return <View key={item.id}>
        {logo &&
          <Image source={logo} resizeMode={"contain"} style={{
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
