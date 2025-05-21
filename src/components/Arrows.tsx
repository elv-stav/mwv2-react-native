import styled from '@emotion/native';
import { Image } from 'react-native';
import arrowSource from "@/assets/arrow-left.png";
import React from 'react';
import { scaledPixels } from "@/design-system/helpers/scaledPixels";


const LeftArrowImage = styled(Image)({
  height: scaledPixels(90),
  width: scaledPixels(70),
  transform: [{ rotate: '180deg' }],
});

const RightArrowImage = styled(Image)({
  height: scaledPixels(90),
  width: scaledPixels(70),
});

export const LeftArrow = React.memo(() => {
  return <LeftArrowImage resizeMode="stretch" tintColor={'white'} source={arrowSource} />;
});
LeftArrow.displayName = 'LeftArrow';

export const RightArrow = React.memo(() => {
  return <RightArrowImage resizeMode="stretch" tintColor={'white'} source={arrowSource} />;
});
RightArrow.displayName = 'RightArrow';

const BottomArrowImage = styled(Image)({
  height: scaledPixels(90),
  width: scaledPixels(70),
  transform: [{ rotate: '90deg' }],
});

const TopArrowImage = styled(Image)({
  height: scaledPixels(90),
  width: scaledPixels(70),
  transform: [{ rotate: '270deg' }],
});

export const BottomArrow = React.memo(() => {
  return <BottomArrowImage resizeMode="stretch" tintColor={'white'} source={arrowSource} />;
});
BottomArrow.displayName = 'BottomArrow';

export const TopArrow = React.memo(() => {
  return <TopArrowImage resizeMode="stretch" tintColor={'white'} source={arrowSource} />;
});
TopArrow.displayName = 'TopArrow';
