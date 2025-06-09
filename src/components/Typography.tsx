import styled from '@emotion/native';
import { ReactNode } from 'react';
import { TextProps } from 'react-native';
import { InterFontFamilies, TypographyStyle } from "@/design-system/theme/typography";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";

// Remove "style" from TextProps to make sure we pass the correct style type.
export type TypographyProps = Omit<TextProps, "style"> & {
  fontFamily?: InterFontFamilies;
  fontSize?: number;
  children?: ReactNode;
  style?: TypographyStyle;
};

export const Typography = ({
                             fontFamily = 'Inter_400Regular',
                             fontSize = scaledPixels(24),
                             children,
                             ...textProps
                           }: TypographyProps) => {
  return (
    <StyledText fontFamily={fontFamily} fontSize={fontSize} {...textProps} >
      {children}
    </StyledText>
  );
};

const StyledText = styled.Text<{
  fontFamily: InterFontFamilies;
  fontSize: number;
}>(({ fontFamily, fontSize }) => ({
  fontFamily,
  fontSize: fontSize,
  color: 'white',
  flexWrap: 'wrap',
}));
