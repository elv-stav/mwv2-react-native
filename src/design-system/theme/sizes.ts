import { scaledPixels } from "@/design-system/helpers/scaledPixels";

export const sizes = {
  program: {
    landscape: { width: scaledPixels(450), height: scaledPixels(200) },
    portrait: { width: scaledPixels(200), height: scaledPixels(250) },
    long: { width: scaledPixels(416), height: scaledPixels(250) },
  },
  propertyCard: {
    width: scaledPixels(320),
    height: scaledPixels(480)
  },
  menu: {
    open: scaledPixels(400),
    closed: scaledPixels(100),
    icon: scaledPixels(20),
  },
};
