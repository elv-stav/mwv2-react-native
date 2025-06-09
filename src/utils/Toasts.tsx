import Toast, { ToastConfig as ToastConfigType } from "react-native-toast-message";
import { ColorValue, View } from "react-native";
import { theme } from "@/design-system/theme/theme";
import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { Typography } from "@/components/Typography";
import React from "react";

export const DebugToast = {
  show(message: string) {
    if (__DEV__) {
      Toast.show({
        text1: message,
        type: "info",
        position: "top"
      });
    }
  }
};

export const ProdToast = {
  show(message: string) {
    Toast.show({
      text1: message,
      position: "bottom"
    });
  }
};

const EluvioToast = ({ text, backgroundColor, borderLeftColor }: {
  text?: string,
  backgroundColor: ColorValue,
  borderLeftColor: ColorValue
}) => (
  <View style={{
    backgroundColor,
    borderLeftColor,
    shadowColor: "#090909",
    paddingHorizontal: scaledPixels(60),
    paddingVertical: scaledPixels(26),
    borderRadius: scaledPixels(10),
    shadowRadius: scaledPixels(30),
    borderLeftWidth: scaledPixels(10),
  }}>
    <Typography fontFamily={"Inter_500Medium"} fontSize={scaledPixels(26)}>{text}</Typography>
  </View>
);

export const ToastConfig: ToastConfigType = {
  success: ({ text1 }) => (
    <EluvioToast text={text1} backgroundColor={theme.colors.background.main} borderLeftColor={"#9D33F3"} />
  ),
  info: ({ text1 }) => (
    <EluvioToast text={text1} backgroundColor={"#2e2e2e"} borderLeftColor={"#EAE09D"} />
  ),
};
