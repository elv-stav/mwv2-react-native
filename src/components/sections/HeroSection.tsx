import { observer } from "mobx-react-lite";
import { Image, View } from "react-native";
import { SectionComponentProps } from "@/components/sections/SectionComponentProps";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { useEffect, useState } from "react";
import { Typography } from "@/components/Typography";
import styled from "@emotion/native";
import { theme } from "@/design-system/theme/theme";

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

      return <View key={item.id} style={{ paddingHorizontal: theme.sizes.carousel.contentPadding }}>
        {!!logo &&
          <Image source={logo} resizeMode={"contain"} style={{
            height: logoHeight,
            width: logoWidth,
          }} />}
        {!!display?.title && <Title>{display.title}</Title>}
        {!!display?.description && <Subtitle>{display.description}</Subtitle>}
      </View>;
    })}
  </>);
});

const Title = styled(Typography)({
  fontSize: scaledPixels(48),
  fontFamily: "Inter_700Bold",
  marginTop: scaledPixels(70),
  marginRight: scaledPixels(660),
});

const Subtitle = styled(Typography)({
  fontSize: scaledPixels(24),
  fontFamily: "Inter_500Medium",
  marginTop: scaledPixels(50),
  marginBottom: scaledPixels(30),
  marginRight: scaledPixels(660),
});

export default HeroSection;
