import styled from '@emotion/native';
import { ReactNode } from 'react';
import { TextProps } from 'react-native';
import { InterFontFamilies, TypographyStyle } from "@/design-system/theme/typography";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";

// Remove "style" from TextProps to make sure we pass the correct style type.
export type TypographyProps = Omit<TextProps, "style"> & {
  fontFamily?: InterFontFamilies;
  children?: ReactNode;
  style?: TypographyStyle;
};

export const Typography = ({
                             fontFamily = 'Inter_400Regular',
                             children,
                             ...textProps
                           }: TypographyProps) => {
  return (
    <StyledText fontFamily={fontFamily} {...textProps} >
      {children}
    </StyledText>
  );
};

const StyledText = styled.Text<{
  fontFamily: InterFontFamilies;
}>(({ fontFamily, theme }) => ({
  fontFamily,
  fontSize: scaledPixels(24),
  lineHeight: scaledPixels(32),
  color: 'white',
  flexWrap: 'wrap',
}));
